use std::{
    io::{self, Write},
    net::{IpAddr, Ipv4Addr},
    process::{Command, Stdio},
    sync::{Arc, Mutex},
};

use base64::{Engine as _, engine::general_purpose::STANDARD};
use defguard_wireguard_rs::{
    InterfaceConfiguration, Userspace, WGApi, WireguardInterfaceApi,
    error::WireguardInterfaceError, key::Key, net::IpAddrMask, peer::Peer,
};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::debug;
use x25519_dalek::{PublicKey, StaticSecret};

use crate::messages::{InterfaceConfig, UserConfig, WgmdError};

pub fn wg_make_pubkey(pkey: &Vec<u8>) -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["pubkey"], Some(pkey))
}

pub fn wg_make_privkey() -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["genkey"], None)
}

pub fn wg_make_psk() -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["genpsk"], None)
}

pub fn wg_quick_up(if_name: &str) -> io::Result<()> {
    run_cmd_stdin("wg-quick", &["up", if_name], None)?;
    Ok(())
}

pub fn wg_quick_down(if_name: &str) -> io::Result<()> {
    run_cmd_stdin("wg-quick", &["down", if_name], None)?;
    Ok(())
}

pub fn wg_get_interfaces() -> io::Result<Vec<String>> {
    //wg show interfaces
    let output = run_cmd_stdin("wg", &["show", "interfaces"], None)?;
    let s = String::from_utf8(output).unwrap();

    Ok(s.split(" ").map(|f| f.to_string()).collect())
}

fn run_cmd_stdin(cmd: &str, args: &[&str], input: Option<&Vec<u8>>) -> io::Result<Vec<u8>> {
    let mut child = Command::new(cmd)
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()?;

    if let Some(i) = input {
        child.stdin.as_mut().unwrap().write_all(&i)?;
    }

    let output = child.wait_with_output()?;
    Ok(output.stdout)
}

/// MARK: - Refactoring with wireguard-rs
pub fn convert_key(bytes: [u8; 32]) -> String {
    STANDARD.encode(bytes)
}

pub struct WireguardManager {
    conf: Vec<InterfaceConfiguration>,
    apis: Vec<WGApi<Userspace>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PeerDbConfig {
    privkey: String,
    //pubkey: String,
    address: u32,
    psk: String,
}

impl WireguardManager {
    pub async fn create_from_database(db: &Arc<Mutex<Connection>>) -> Result<Self, WgmdError> {
        let db = db.lock().unwrap();

        let mut stmt =
        db.prepare("SELECT id, name, address, listenport, netmask, privatekey, mtu, endpoint, users, dns FROM InterfaceConfigsKeys WHERE enabled = 1")?;
        let mut rows = stmt.query(()).unwrap();

        let mut apis = Vec::new();
        let mut conf = Vec::new();

        while let Some(row) = rows.next()? {
            println!("{:#?}", row);
            let na: u32 = row.get("address")?;
            let mask: u8 = row.get("netmask")?;
            let name: String = row.get("name")?;
            let mtu: u32 = row.get("mtu")?;
            let privkey: String = row.get("privatekey")?;
            let privkey = hex::decode(privkey).unwrap();
            let privkey: [u8; 32] = privkey.try_into().unwrap();
            //let pubkey: Vec<u8> = row.get("pubkey")?;
            //let pubkey: [u8; 32] = pubkey.try_into().unwrap();
            let port = row.get("listenport")?;

            let v: String = row.get("users")?;
            let users: Vec<PeerDbConfig> = serde_json::from_str(&v)?;
            let mut peers = Vec::new();

            let wg = WGApi::<Userspace>::new(&name).unwrap();

            for user in users.iter() {
                let secret = hex::decode(user.privkey.clone()).unwrap();
                let secret: [u8; 32] = secret.try_into().unwrap();
                let secret = StaticSecret::from(secret);

                let key = PublicKey::from(&secret);
                let peer_key: Key = key.as_ref().try_into().unwrap();
                let mut peer = Peer::new(peer_key);
                let addr = IpAddrMask::new(IpAddr::V4(Ipv4Addr::from(user.address)), 32);
                peer.allowed_ips.push(addr);
                //wg.configure_peer(&peer);
                peers.push(peer);
            }

            let ip = IpAddrMask::new(IpAddr::V4(Ipv4Addr::from(na)), mask);

            apis.push(wg);

            conf.push(InterfaceConfiguration {
                name: name,
                prvkey: convert_key(privkey),
                addresses: vec![ip],
                port,
                peers,
                mtu: Some(mtu),
                fwmark: None,
            });
        }

        Ok(Self { conf, apis })
    }

    pub fn start(&mut self) -> Result<(), WireguardInterfaceError> {
        for (i, wg) in self.apis.iter_mut().enumerate() {
            //a.1.create_interface().unwrap();

            let conf = self.conf.get(i).unwrap();
            wg.create_interface()?;
            wg.configure_interface(conf)?;

            
            let host = wg.read_interface_data().unwrap();
            println!("WireGuard configuration: {host:#?}");
            
            for peer in conf.peers.iter() {
                wg.configure_peer(&peer)?;
            }
            
            wg.configure_peer_routing(&conf.peers)?;
        }
        Ok(())
    }

    pub fn stop(&mut self) {
        for interface in self.apis.iter_mut() {
            interface.remove_interface().unwrap();
        }
    }
}

#[cfg(test)]
mod tests {
    use rusqlite::Connection;
    use x25519_dalek::StaticSecret;

    use crate::DB_QUERY;

    fn debug_database() -> Connection {
        let db = Connection::open(":memory:").unwrap();
        db.execute_batch(DB_QUERY).unwrap();
        db
    }

    #[test]
    fn test_database_loading() {
        let db = debug_database();

        let key = StaticSecret::random();
        let as_bytes = key.as_bytes();

        let mut p = db.prepare("SELECT hex(?) as key").unwrap();
        let r = p
            .query_one((as_bytes,), |row| {
                let c: String = row.get("key").unwrap();
                Ok(hex::decode(c).unwrap())
            })
            .unwrap();

        println!("{:?}", r);
        println!("{:?}", as_bytes);
        assert_eq!(r, as_bytes.to_vec());
        //p.
    }
}
