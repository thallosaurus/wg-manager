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

pub fn insert_dns_root(db: &Connection, interface_id: i64, domain: String) -> Result<i64, rusqlite::Error> {
    let mut stmt = db.prepare("INSERT INTO dns (interface_id, domain) VALUES(?, ?)")?;
    stmt.execute((interface_id, domain))?;

    Ok(db.last_insert_rowid())
}

fn get_active_dns_servers(db: &Connection) -> Result<Vec<DnsmasqRuntimeConfig>, rusqlite::Error> {
    let mut stmt = db.prepare("SELECT domain, interfacename, address, subdomains FROM DnsServersNew")?;
    let mut rows = stmt.query(())?;

    let mut result = Vec::new();

    while let Some(row) = rows.next()? {
        let interface = row.get("interfacename")?;
        let domain = row.get("domain")?;

        let a: u32 = row.get("address")?;
        //let address = Ipv4Addr::from(a);
        let sdomains: String = row.get("subdomains")?;
        let subdomains = serde_json::from_str(&sdomains).unwrap();

        result.push(DnsmasqRuntimeConfig {
            interface,
            domain,
            address: a,
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

    pub fn from_db_into(db: &Connection, host: &mut Self) -> io::Result<()>{
        let active = get_active_dns_servers(db).unwrap();

        for s in active {
            host.add_config_instance(s)?;
        }
        Ok(())
    }

    pub fn from_db(db: &Connection) -> io::Result<Self> {
        let mut d = Self::new();

        Self::from_db_into(db, &mut d)?;

        Ok(d)
    }

    pub fn add_config_instance(&mut self, conf: DnsmasqRuntimeConfig) -> io::Result<()> {

        let octs = Ipv4Addr::from(conf.address).to_bits();

        self.instances
            .insert(octs, run_dnsmasq_config(conf)?);
        Ok(())
    }

    pub async fn stop_all_instances(&mut self) -> io::Result<()> {
        for (_, dns) in self.instances.iter_mut() {
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
    config: DnsmasqRuntimeConfig
}

//pub fn export_config()

#[derive(Serialize, Deserialize, Debug)]
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

#[derive(Debug)]
pub struct DnsmasqRuntimeConfig {
    //port: u16,
    domain: String,
    interface: String,
    address: u32,
    subdomains: Vec<DnsmasqRuntimeSubdomainConfig>,
}

impl DnsmasqRuntimeConfig {
    fn to_command_args(&self) -> Vec<String> {
        let ip = Ipv4Addr::from(self.address);
        let mut a = Vec::new();
        a.push("-k".into());
        //a.push("--port=6666".into());
        a.push("--bind-interface".into());
        a.push("--leasefile-ro".into());
        a.push("--no-resolv".into());
        a.push(format!("--no-dhcp-interface={}", self.interface).into());
        a.push(format!("--interface={}", self.interface).into());
        a.push(format!("--listen-address={}", ip.to_string()).into());

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

    let octs = Ipv4Addr::from(config.address).to_bits();
    Ok(Dnsmasq {
        id: Some(octs),
        pid,
        handle,
        config
    })
}

impl Dnsmasq {
    pub async fn stop(&mut self) {
        debug!("killing dnsmasq id {:?}", self.id);
        self.handle.kill().await.unwrap();
        self.handle.wait().await.unwrap();
    }
}
