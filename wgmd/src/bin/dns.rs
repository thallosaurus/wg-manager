use rusqlite::Connection;
use tokio::signal::unix::{SignalKind, signal};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use wgmd::dns::DnsmasqHost;

const DB_PATH: &str = "./manager.db";

#[tokio::main]
async fn main() {
    init_tracing();
    
    let db = Connection::open(DB_PATH).unwrap();
    info!("Open Database at path {}", DB_PATH);
    
    let mut host = DnsmasqHost::from_db(&db).unwrap();

    //let id = host.add_instance().unwrap();
    //let dns = run_dnsmasq("wg0").unwrap();
    //println!("{:?}", dns);

    let mut sigterm = signal(SignalKind::interrupt()).unwrap();

    loop {
        if let Some(_) = sigterm.recv().await {
            println!("ctrl-c pressed");
            break;
        }
    }

    host.stop_all_instances().await.unwrap();
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        /*.with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                #[cfg(debug_assertions)]
                return format!("{}=trace", env!("CARGO_CRATE_NAME")).into();

                #[cfg(not(debug_assertions))]
                return format!("{}=info", env!("CARGO_CRATE_NAME")).into();
            }),
        )
        */
        .init();
}
