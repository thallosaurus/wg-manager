use tokio::net::UnixStream;
use wgmd::{client::SocketConnection, messages::ExportClientRequest};

#[tokio::main]
async fn main() {
    let stream = UnixStream::connect("./wgmd.sock").await.unwrap();
    let conn = SocketConnection::new(stream);
    //let conn = SSHSocketConnection::new("rillo", "nas.local").await;
    let res = conn
        .export_client(ExportClientRequest {
            interface_id: 1,
            user_id: 1,
        })
        .await
        .unwrap();
    println!("{:?}", res);
}
