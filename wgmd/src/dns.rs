use std::{
    collections::HashMap,
    io,
    net::Ipv4Addr,
    sync::atomic::{
        AtomicU32,
        Ordering::{self, SeqCst},
    },
};

use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use tokio::process::{Child, Command};
use tracing::debug;

pub const CONFIG_HEADER: &str = "bind-interfaces
no-hosts";

fn get_active_dns_servers(db: &Connection) -> Result<Vec<DnsmasqRuntimeConfig>, rusqlite::Error> {
    let mut stmt = db.prepare("SELECT domain, if_name, address, subdomains FROM DnsServersNew")?;
    let mut rows = stmt.query(())?;

    let mut result = Vec::new();

    while let Some(row) = rows.next()? {
        let interface = row.get("if_name")?;
        let domain = row.get("domain")?;

        let a: u32 = row.get("address")?;
        let address = Ipv4Addr::from(a);
        let sdomains: String = row.get("subdomains")?;
        let subdomains = serde_json::from_str(&sdomains).unwrap();

        result.push(DnsmasqRuntimeConfig {
            interface,
            domain,
            address,
            subdomains,
        });
    }

    Ok(result)
}

pub struct DnsmasqHost {
    instances: HashMap<u32, Dnsmasq>,
    next_id: AtomicU32,
}

impl DnsmasqHost {
    pub fn new() -> Self {
        Self {
            instances: HashMap::new(),
            next_id: AtomicU32::new(0),
        }
    }

    pub fn from_db(db: &Connection) -> io::Result<Self> {
        let active = get_active_dns_servers(db).unwrap();
        let mut d = Self::new();

        for s in active {
            d.add_config_instance(s)?;
        }

        Ok(d)
    }

    pub fn add_config_instance(&mut self, conf: DnsmasqRuntimeConfig) -> io::Result<()> {
        self.instances
            .insert(conf.address.to_bits(), run_dnsmasq_config(conf)?);
        Ok(())
    }

    #[deprecated]
    pub fn add_instance(&mut self) -> io::Result<u32> {
        let id = self.next_id.load(Ordering::Relaxed);
        self.instances.insert(id, run_dnsmasq(Some(id))?);

        self.next_id.fetch_add(1, Ordering::Relaxed);

        Ok(id)
    }

    pub async fn stop_all_instances(&mut self) -> io::Result<()> {
        for (id, dns) in self.instances.iter_mut() {
            dns.stop().await;
        }
        self.instances.clear();

        Ok(())
    }
}

#[derive(Debug)]
pub struct Dnsmasq {
    id: Option<u32>,
    pid: Option<u32>,
    handle: Child,
}

//pub fn export_config()

#[derive(Serialize, Deserialize)]
pub struct DnsmasqRuntimeSubdomainConfig {
    domain: String,
    address: u32,
}

impl DnsmasqRuntimeSubdomainConfig {
    fn to_arg(&self, tld: &String) -> Vec<String> {
        let a = Ipv4Addr::from(self.address);
        let octets = a.octets();

        vec![
            format!("--host-record={}.{},{}", self.domain, tld, a.to_string()),
            format!("--ptr-record={}.{}.{}.{}.in-addr.arpa={}.{}", octets[3], octets[2], octets[1], octets[0], self.domain, tld),
        ]
    }
}

pub struct DnsmasqRuntimeConfig {
    //port: u16,
    domain: String,
    interface: String,
    address: Ipv4Addr,
    subdomains: Vec<DnsmasqRuntimeSubdomainConfig>,
}

impl DnsmasqRuntimeConfig {
    fn to_command_args(&self) -> Vec<String> {
        let mut a = Vec::new();
        a.push("-k".into());
        //a.push("--port=6666".into());
        a.push("--bind-interface".into());
        a.push("--leasefile-ro".into());
        a.push("--no-resolv".into());
        a.push(format!("--no-dhcp-interface={}", self.interface).into());
        a.push(format!("--interface={}", self.interface).into());
        a.push(format!("--listen-address={}", self.address.to_string()).into());

        for sub in self.subdomains.iter() {
            let mut s = sub.to_arg(&self.domain);
            a.append(&mut s);
        }

        debug!("{:?}", a);
        a
    }
}

pub fn run_dnsmasq_config(config: DnsmasqRuntimeConfig) -> io::Result<Dnsmasq> {
    let args = config.to_command_args();
    let mut cmd = Command::new("dnsmasq");
    let c = cmd.args(args);
    let handle = c.spawn()?;
    let pid = handle.id();

    Ok(Dnsmasq {
        id: Some(config.address.to_bits()),
        pid,
        handle,
    })
}

pub fn run_dnsmasq(id: Option<u32>) -> io::Result<Dnsmasq> {
    let cmd = Command::new("dnsmasq")
        .args([
            "-k",
            "--port=6666",
            "--bind-interfaces", //format!("--conf-file=/var/lib/wgmd/dns/{}.conf", if_name).as_str(),
        ])
        .spawn()?;
    let pid = cmd.id();

    Ok(Dnsmasq {
        id,
        pid,
        handle: cmd,
    })
}

impl Dnsmasq {
    pub async fn stop(&mut self) {
        debug!("killing dnsmasq id {:?}", self.id);
        self.handle.kill().await.unwrap();
        self.handle.wait().await.unwrap();
    }
}
