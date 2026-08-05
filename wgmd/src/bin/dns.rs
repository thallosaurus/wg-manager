use tokio::{signal::unix::{SignalKind, signal}, sync::{mpsc, oneshot}, time::Sleep};
use wgmd::dns::run_dnsmasq;

#[tokio::main]
async fn main() {
    let dns = run_dnsmasq("wg0").unwrap();
    println!("{:?}", dns);


    let sigterm = signal(SignalKind::interrupt()).unwrap();

}