use std::ops::ControlFlow;

use tokio::{io::{AsyncBufReadExt, AsyncWriteExt, BufReader}, net::{UnixListener, UnixSocket, UnixStream}};

use crate::messages::WgmdMessages;

mod messages;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let dir = tempfile::tempdir().unwrap();
    let p = "wgmd.sock";
    let path = dir.path().join(p);

    let _ = std::fs::remove_file(&path);
    let listener = UnixListener::bind(&path)?;
    println!("Listening to {}", path.display());

    loop {
        let (stream, _) = listener.accept().await?;

        tokio::spawn(async move {
            if let Err(e) = handle_client(stream).await {
                eprintln!("{e}")
            }
        });
    }
}

async fn handle_client(stream: UnixStream) -> std::io::Result<()> {
    let (reader, mut writer) = stream.into_split();

    let mut reader = BufReader::new(reader);
    let mut line = String::new();

    while reader.read_line(&mut line).await? != 0 {
        let l = line.trim();
        //println!("Received: {}", line.trim());

        let json: Result<WgmdMessages, serde_json::Error> = serde_json::from_str(&l);
        line.clear();

        if let Ok(data) = json {
            process_message(data);
            writer.write_all(br#"{"success":true}"#).await?;
            writer.write_all(b"\n").await?;
        } else {
            writer.write_all(br#"{"success":false}"#).await?;
            writer.write_all(b"\n").await?;
        }        
    }
    
    Ok(())
}

fn process_message(m: WgmdMessages) {
    println!("{:?}", m);
    match m {
        WgmdMessages::UpdateInterface { if_name, config } => {

        },
        WgmdMessages::RemoveInterface { if_name } => {

        },
    }
}