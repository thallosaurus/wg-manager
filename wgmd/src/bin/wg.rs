use std::{net::{IpAddr, Ipv4Addr}, thread, time::Duration};

use defguard_wireguard_rs::{
    InterfaceConfiguration, WGApi, WireguardInterfaceApi, key::Key, net::IpAddrMask, peer::Peer,
};
use rusqlite::Connection;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use wgmd::interfaces::{WireguardManager, convert_key};
use x25519_dalek::{PublicKey, StaticSecret};

const DB_PATH: &str = "./manager.db";

fn main() {
    init_tracing();
    let db = Connection::open(DB_PATH).unwrap();
    info!("Open Database at path {}", DB_PATH);

    let mut mgr = WireguardManager::create_from_database(&db).unwrap();

    thread::sleep(Duration::from_secs(10));
    mgr.stop();
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                #[cfg(debug_assertions)]
                return format!("{}=trace", env!("CARGO_CRATE_NAME")).into();

                #[cfg(not(debug_assertions))]
                return format!("{}=info", env!("CARGO_CRATE_NAME")).into();
            }),
        )
        .init();
}