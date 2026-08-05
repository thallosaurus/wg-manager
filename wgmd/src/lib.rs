use std::sync::Arc;

use rusqlite::Connection;
use tokio::{
    io,
    signal::unix::{Signal, SignalKind, signal},
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::{UnixListener, UnixStream},
    sync::Mutex,
};
use tracing::{debug, error, info};
use crate::messages::{WgmdMessages, process_message};

mod interfaces;
pub mod messages;
pub mod client;

const DB_QUERY: &str = include_str!("../database.sql");

pub(crate) type Signals = (Signal, Signal);
pub struct Wgmd;

impl Wgmd {
    pub async fn listen(listener: &UnixListener, db: Connection) -> io::Result<()> {
        db.execute_batch(DB_QUERY).unwrap();
        let db_ref = Arc::new(Mutex::new(db));
        let sigterm = signal(SignalKind::terminate())?;
        let sigint = signal(SignalKind::interrupt())?;
        Self::main_loop(
            (sigint, sigterm),
            listener,
            db_ref)
            .await
            .unwrap();

        info!("Quitting...");
        //drop(listener);
        //fs::remove_file(path)?;

        Ok(())
    }

    async fn main_loop(
        signals: Signals,
        listener: &UnixListener,
        db_ref: Arc<Mutex<Connection>>,
    ) -> io::Result<()> {
        let (mut sigint, mut sigterm) = signals;
        loop {
            tokio::select! {
            result = listener.accept() => {
                let (stream, _) = result?;
                info!("new socket connection");

                let db = db_ref.clone();
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
}

async fn handle_client(stream: UnixStream, db: Arc<Mutex<Connection>>) -> std::io::Result<()> {
    let (reader, mut writer) = stream.into_split();

    let mut reader = BufReader::new(reader);
    let mut line = String::new();

    while reader.read_line(&mut line).await? != 0 {
        let l = line.trim();
        //println!("Received: {}", line.trim());
        //debug!("{}", l);

        let json: Result<WgmdMessages, serde_json::Error> = serde_json::from_str(&l);
        line.clear();

        let db = db.lock().await;

        if let Ok(data) = json {
            let answer = process_message(data, &db);
            debug!("{:?}", answer);
            let json = serde_json::to_string(&answer).unwrap();

            writer.write_all(&json.into_bytes()).await?;
            writer.write_all(b"\n").await?;
        } else {
            let e = json.err().unwrap();
            error!("{}", e);
            writer.write_all(br#"{"success":false}"#).await?;
            writer.write_all(b"\n").await?;
        }
    }

    Ok(())
}
