use std::{
    eprintln, fs::Permissions, os::unix::fs::PermissionsExt, println, sync::Arc,
};

use rusqlite::Connection;
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::{UnixListener, UnixStream},
    sync::Mutex,
};
use users::{get_current_groupname, get_current_username, get_group_by_gid, get_group_by_name, get_user_by_name, get_user_by_uid};

use crate::messages::{WgmdMessages, process_message};
use std::os::unix::fs::chown;

mod interfaces;
mod messages;

const DB_QUERY: &str = include_str!("../database.sql");

#[cfg(not(debug_assertions))]
const path: &str = "/var/run/wgmd.sock";

#[cfg(debug_assertions)]
const path: &str = "./wgmd.sock";

fn setup_socket() -> std::io::Result<UnixListener> {
    let _ = std::fs::remove_file(&path);
    let listener = UnixListener::bind(&path)?;
    let _ = std::fs::set_permissions(&path, Permissions::from_mode(0o660)).unwrap();
    //let u = get_user_by_name(&get_current_username().unwrap()).unwrap_or(get_user_by_uid(0).unwrap());
    //let g = get_group_by_name(&get_current_groupname().unwrap()).unwrap_or(get_group_by_gid(0).unwrap());
    //chown(path, Some(u.uid()), Some(g.gid())).unwrap();

    println!("Listening to {}", path);

    Ok(listener)
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let listener = setup_socket()?;    
    let db = Connection::open("/var/lib/wgmd/manager.db").unwrap();
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
