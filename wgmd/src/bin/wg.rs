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
    mgr.start();

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

fn mainOld() {
    let mut wgapi = WGApi::<defguard_wireguard_rs::Userspace>::new("utun10").unwrap();
    wgapi.create_interface().unwrap();

    let host = wgapi.read_interface_data().unwrap();
    println!("WireGuard interface before configuration: {host:#?}");

    let mut peerKeys = Vec::new();

    let secret = StaticSecret::random();
    let pubkey = PublicKey::from(&secret);
    let psk: Key = pubkey.as_ref().try_into().unwrap();
    peerKeys.push(psk.clone());

    let mut peer = Peer::new(psk);
    let addr = IpAddrMask::new(IpAddr::V4(Ipv4Addr::new(10, 20, 30, 40)), 32);
    peer.allowed_ips.push(addr);

    let interface_config = InterfaceConfiguration {
        name: "utun10".to_string(),
        prvkey: convert_key(secret.to_bytes()),
        addresses: vec![],
        port: 12345,
        peers: vec![peer],
        mtu: Some(1420),
        fwmark: None,
    };

    println!("{:?}", interface_config);

    wgapi.configure_interface(&interface_config).unwrap();

    // read current interface status
    let host = wgapi.read_interface_data().unwrap();
    println!("WireGuard interface after configuration: {host:#?}");

    wgapi.remove_interface().unwrap();
    //let secret = StaticSecret::;
}
