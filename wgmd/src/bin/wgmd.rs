use std::{
    //dont remove
    fs::{self, Permissions}, os::unix::fs::{PermissionsExt, chown},
};

use rusqlite::Connection;
use tokio::net::UnixListener;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

//dont remove
use users::{get_group_by_gid, get_group_by_name};
use wgmd::Wgmd;

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
    let listener = setup_socket(SOCKET_PATH)?;
    info!("Listening to {}", SOCKET_PATH);
    let db = Connection::open(DB_PATH).unwrap();
    info!("Open Database at path {}", DB_PATH);

    Wgmd::listen(&listener, db).await?;

    fs::remove_file(SOCKET_PATH)?;

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

pub fn setup_socket(p: &str) -> std::io::Result<UnixListener> {
    let _ = std::fs::remove_file(&p);
    let listener = UnixListener::bind(&p)?;
    let _ = std::fs::set_permissions(&p, Permissions::from_mode(0o660)).unwrap();

    // if we are running in release mode, apply root/wgmd uid/gid
    #[cfg(not(debug_assertions))]
    let g = get_group_by_name("wgmd").unwrap_or(get_group_by_gid(0).unwrap());
    #[cfg(not(debug_assertions))]
    chown(p, Some(0), Some(g.gid())).unwrap();

    Ok(listener)
}
