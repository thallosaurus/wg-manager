use std::{
    fs::{self, Permissions}, os::unix::fs::{PermissionsExt, chown}, sync::Arc,
};

use rusqlite::Connection;
use tokio::{net::UnixListener, process::Command};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::sync::Mutex;

//dont remove
use users::{get_group_by_gid, get_group_by_name};
use wgmd::{Wgmd, dns::DnsmasqHost, interfaces::WireguardManager, listen, open_database};

#[cfg(not(debug_assertions))]
const SOCKET_PATH: &str = "/var/run/wgmd.sock";

#[cfg(not(debug_assertions))]
const DB_PATH: &str = "/var/lib/wgmd/manager.db";

#[cfg(debug_assertions)]
const SOCKET_PATH: &str = "./wgmd.sock";

#[cfg(debug_assertions)]
const DB_PATH: &str = "./manager.db";

#[tokio::main]
async fn main() -> std::io::Result<()> {
    init_tracing();

    // open database
    let db = Arc::new(Mutex::new(open_database(DB_PATH).unwrap()));

    //open wireguard interfaces
    let mut wg_manager = WireguardManager::create_from_database(&db).await.unwrap();
    wg_manager.start().unwrap();

    //open dns
    let mut dns = DnsmasqHost::from_db(&db).unwrap();

    //open comm listener
    info!("Listening to {}", SOCKET_PATH);
    listen(SOCKET_PATH, &db).await?;

    wg_manager.stop();;
    dns.stop_all_instances().await.unwrap();

    Ok(())
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


