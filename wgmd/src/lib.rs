use std::{
    fs::Permissions,
    os::unix::fs::PermissionsExt,
    sync::{Arc, Mutex},
};

use crate::{
    messages::{WgmdError, WgmdMessages, process_message},
};
use rusqlite::Connection;
use tokio::{
    io,
    signal::unix::Signal,
    sync::oneshot,
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

//pub(crate) type Signals = (Signal, Signal);

pub fn open_database(path: &str) -> rusqlite::Result<Connection> {
    let db = Connection::open(path).unwrap();
    info!("Open Database at path {}", path);
    db.execute_batch(DB_QUERY).unwrap();
    Ok(db)
}

pub struct Wgmd {
    //listener: UnixListener,
}

pub fn listen(path: &str, db: &Arc<Mutex<Connection>>) -> io::Result<oneshot::Sender<()>> {
    //db.execute_batch(DB_QUERY).unwrap();
    let (tx, rx) = oneshot::channel();

    let listener = setup_socket(path)?;
    listen_to(listener, db, rx)?;

    Ok(tx)
}

fn listen_to(
    listener: UnixListener,
    db: &Arc<Mutex<Connection>>,
    mut oshot: oneshot::Receiver<()>,
) -> io::Result<()> {
    //let db_ref = Arc::new(Mutex::new(db));

    let db = Arc::clone(db);
    tokio::spawn(async move {
        loop {
            if let Ok(s) = oshot.try_recv() {
                break;
            }

            if let Ok((stream, _)) = listener.accept().await {
                info!("new socket connection");
                if let Err(e) = handle_client(stream, &db).await {
                    error!("{}", e);
                    //eprintln!("{e}")
                }
            }
        }
    });

    Ok(())
}

async fn handle_client(
    stream: UnixStream,
    db: &Arc<Mutex<Connection>>,
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
