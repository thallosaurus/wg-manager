use std::io;

use rusqlite::Connection;
use tokio::{
    process::Command,
    sync::{mpsc, oneshot},
};
use tracing::debug;

pub const CONFIG_HEADER: &str = "bind-interfaces
no-hosts";

fn get_active_dns_servers(db: &Connection) -> Result<Vec<String>, rusqlite::Error> {
    let mut stmt = db.prepare("SELECT if_name FROM DnsServers")?;
    let mut rows = stmt.query(())?;

    let mut result = Vec::new();

    while let Some(row) = rows.next()? {
        let i = row.get_unwrap("if_name");
        result.push(i);
    }

    Ok(result)
}

pub struct DnsmasqHost {
    instances: Vec<Dnsmasq>,
}

impl DnsmasqHost {
    pub fn new() -> Self {
        Self {
            instances: Vec::new(),
        }
    }

    pub fn from_db(db: &Connection) -> io::Result<Self> {
        let active = get_active_dns_servers(db).unwrap();
        let mut d = Self::new();

        for s in active {
            d.add_instance(&s)?;
        }

        Ok(d)
    }

    pub fn add_instance(&mut self, if_name: &str) -> io::Result<()> {
        self.instances.push(run_dnsmasq(if_name)?);
        Ok(())
    }

    pub fn stop_all_instances(&mut self) -> io::Result<()> {
        for i in self.instances.iter() {
            i.stop();
        }
        self.instances.clear();

        Ok(())
    }
}

#[derive(Debug)]
pub struct Dnsmasq {
    pub stop: mpsc::Sender<()>,
    pid: Option<u32>,
}

//pub fn export_config()

pub fn run_dnsmasq(if_name: &str) -> io::Result<Dnsmasq> {
    let (stop, mut rx) = mpsc::channel::<()>(1);

    let mut cmd = Command::new("dnsmasq")
        .args([
            "-k",
            "--port=6666",
            //format!("--conf-file=/var/lib/wgmd/dns/{}.conf", if_name).as_str(),
        ])
        .spawn()?;
    let pid = cmd.id();

    tokio::spawn(async move {
        tokio::select! {
            Ok(exitcode) = cmd.wait() => {
                debug!("process exited with code: {:?}", exitcode.code());
            }
            _ = rx.recv() => {
                cmd.kill().await.unwrap();
                debug!("stopping dnsmasq server");
            }
        }
    });

    Ok(Dnsmasq { stop, pid })
}

impl Dnsmasq {
    pub fn stop(&self) {
        self.stop.blocking_send(()).unwrap();
    }
}
