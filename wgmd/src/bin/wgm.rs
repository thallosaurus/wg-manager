use tokio::net::UnixStream;
use wgmd::client::{SocketConnection};

#[tokio::main]
async fn main() {
    let stream = UnixStream::connect("./wgmd.sock").await.unwrap();
    let conn = SocketConnection::new(stream);
    //let conn = SSHSocketConnection::new("rillo", "nas.local").await;
    let res = conn.query_all_interfaces().await.unwrap();
    println!("{:?}", res);
}