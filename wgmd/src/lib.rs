use std::{fs::{self, Permissions}, os::unix::fs::PermissionsExt, sync::{Arc, Mutex}};

use crate::{
    dns::DnsmasqHost,
    messages::{WgmdError, WgmdMessages, process_message},
};
use rusqlite::Connection;
use tokio::{
    io,
    signal::unix::{Signal, SignalKind, signal},
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::{UnixListener, UnixStream},
};
use tracing::{error, info};

pub mod client;
pub mod config;
pub mod dns;
pub mod interfaces;
pub mod messages;

const DB_QUERY: &str = include_str!("../database.sql");

pub(crate) type Signals = (Signal, Signal);

#[cfg(not(debug_assertions))]
const SOCKET_PATH: &str = "/var/run/wgmd.sock";

#[cfg(not(debug_assertions))]
const DB_PATH: &str = "/var/lib/wgmd/manager.db";

#[cfg(debug_assertions)]
const SOCKET_PATH: &str = "./wgmd.sock";

#[cfg(debug_assertions)]
const DB_PATH: &str = "./manager.db";

pub fn open_database(path: &str) -> rusqlite::Result<Connection> {
    let db = Connection::open(DB_PATH).unwrap();
    info!("Open Database at path {}", DB_PATH);
    db.execute_batch(DB_QUERY).unwrap();
    Ok(db)
}

pub struct Wgmd {
    //listener: UnixListener,
}

pub async fn listen(path: &str, db: &Arc<Mutex<Connection>>) -> io::Result<()> {
    //db.execute_batch(DB_QUERY).unwrap();
    let listener = setup_socket(path)?;
    listen_to(listener, db).await;
    info!("Quitting...");
    fs::remove_file(SOCKET_PATH)?;
    Ok(())
}

async fn listen_to(listener: UnixListener, db: &Arc<Mutex<Connection>>) -> io::Result<()> {
    //let db_ref = Arc::new(Mutex::new(db));
    let sigterm = signal(SignalKind::terminate())?;
    let sigint = signal(SignalKind::interrupt())?;
    main_loop((sigint, sigterm), &listener, db)
        .await
        .unwrap();
    
    Ok(())
}

async fn main_loop(
    signals: Signals,
    listener: &UnixListener,
    db_ref: &Arc<Mutex<Connection>>,
    //dns_ref: Arc<Mutex<DnsmasqHost>>,
) -> io::Result<()> {
    let (mut sigint, mut sigterm) = signals;
    loop {
        tokio::select! {
        result = listener.accept() => {
            let (stream, _) = result?;
            info!("new socket connection");

            let db = db_ref.clone();
            //let dns = dns_ref.clone();
            tokio::spawn(async move {
                if let Err(e) = handle_client(stream, db).await {
                    error!("{}", e);
                    //eprintln!("{e}")
                }
            });
        }
        _ = sigterm.recv() => {
            break;
        }
        _ = sigint.recv() => {
            break;
        }

        }
    }
    info!("socket connection exit");
    Ok(())
}

async fn handle_client(
    stream: UnixStream,
    db: Arc<Mutex<Connection>>,
    //dns: Arc<Mutex<DnsmasqHost>>,
) -> std::io::Result<()> {
    let (reader, mut writer) = stream.into_split();

    let mut reader = BufReader::new(reader);
    let mut line = String::new();

    while reader.read_line(&mut line).await? != 0 {
        let l = line.trim();
        //println!("Received: {}", line.trim());
        //debug!("{}", l);

        let json: Result<WgmdMessages, serde_json::Error> = serde_json::from_str(&l);
        line.clear();

        //let db = db.lock().await;
        //let mut dns = dns.lock().await;

        if let Ok(data) = json {
            let answer = match process_message(data, db.clone()).await {
                Ok(answer) => serde_json::to_string(&answer),
                Err(e) => serde_json::to_string(&e),
            }?;

            writer.write_all(&answer.into_bytes()).await?;
            writer.write_all(b"\n").await?;
        } else {
            let e = json.err().unwrap();
            error!("{}", e);
            let e: WgmdError = e.into();
            writer.write_all(&serde_json::to_vec(&e).unwrap()).await?;
            writer.write_all(b"\n").await?;
        }
    }

    Ok(())
}

pub fn setup_socket(p: &str) -> std::io::Result<UnixListener> {
    let _ = std::fs::remove_file(&p);
    let listener = UnixListener::bind(&p)?;
    let _ = std::fs::set_permissions(&p, Permissions::from_mode(0o660)).unwrap();

    // if we are running in release mode, apply root/wgmd uid/gid
    #[cfg(not(debug_assertions))]
    let g = get_group_by_name("wgmd").unwrap_or(get_group_by_gid(0).unwrap());
    #[cfg(not(debug_assertions))]
    chown(p, Some(0), Some(g.gid())).unwrap();

    Ok(listener)
}