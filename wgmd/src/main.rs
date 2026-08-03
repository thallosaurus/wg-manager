use std::{
    eprintln, fs::Permissions, os::unix::fs::PermissionsExt, println, sync::Arc,
};

use rusqlite::Connection;
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::{UnixListener, UnixStream},
    sync::Mutex,
};

use crate::messages::{WgmdMessages, process_message};

mod interfaces;
mod messages;

const DB_QUERY: &str = include_str!("../database.sql");

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let dir = tempfile::tempdir().unwrap();
//    #[cfg(not(debug_assertions))]
    let path = "/var/run/wgmd.sock";

//    #[cfg(debug_assertions)]
//    let path = dir.path().join("wgmd.sock");
    println!("Listening to {}", path);

    //    let privkey = run_cmd_stdin("wg", &["genkey"], None).unwrap();
    //    let pubkey = run_cmd_stdin("wg", &["pubkey"], Some(&privkey)).unwrap();

    //println!("priv: {:?}\npub: {:?}", String::from_utf8(privkey), String::from_utf8(pubkey));

    let _ = std::fs::remove_file(&path);
    let listener = UnixListener::bind(&path)?;

    //#[cfg(not(debug_assertions))]
    let _ = std::fs::set_permissions(&path, Permissions::from_mode(0o600)).unwrap();

    let db = Connection::open("wg_manager_rs.db").unwrap();
    db.execute_batch(DB_QUERY).unwrap();
    let db_ref = Arc::new(Mutex::new(db));

    loop {
        let (stream, _) = listener.accept().await?;
        let db = db_ref.clone();
        tokio::spawn(async move {
            if let Err(e) = handle_client(stream, db).await {
                eprintln!("{e}")
            }
        });
    }
}

async fn handle_client(stream: UnixStream, db: Arc<Mutex<Connection>>) -> std::io::Result<()> {
    let (reader, mut writer) = stream.into_split();

    let mut reader = BufReader::new(reader);
    let mut line = String::new();

    while reader.read_line(&mut line).await? != 0 {
        let l = line.trim();
        //println!("Received: {}", line.trim());

        let json: Result<WgmdMessages, serde_json::Error> = serde_json::from_str(&l);
        line.clear();

        let db = db.lock().await;

        if let Ok(data) = json {
            let answer = process_message(data, &db);
            let json = serde_json::to_string(&answer).unwrap();

            writer.write_all(&json.into_bytes()).await?;
            writer.write_all(b"\n").await?;
        } else {
            let e = json.err().unwrap();
            eprintln!("{e}");
            writer.write_all(br#"{"success":false}"#).await?;
            writer.write_all(b"\n").await?;
        }
    }

    Ok(())
}
