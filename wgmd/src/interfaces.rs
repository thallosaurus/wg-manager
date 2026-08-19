use std::{
    io::{self, Write},
    net::{IpAddr, Ipv4Addr},
    process::{Command, Stdio},
};

use base64::{Engine as _, engine::general_purpose::STANDARD};
use defguard_wireguard_rs::{
    InterfaceConfiguration, Userspace, WGApi, WireguardInterfaceApi, key::Key, net::IpAddrMask,
    peer::Peer,
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
    apis: Vec<WGApi<Userspace>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PeerDbConfig {
    privatekey: Vec<u8>,
    publickey: Vec<u8>,
    address: u32,
    psk: Vec<u8>,
}

impl WireguardManager {
    pub fn create_from_database(db: &Connection) -> Result<Self, WgmdError> {
        let mut stmt =
        db.prepare("SELECT id, name, address, listenport, netmask, privatekey, pubkey, mtu, endpoint, users, dns FROM InterfaceConfigsKeys WHERE enabled = 1").unwrap();
        let mut rows = stmt.query(()).unwrap();

        let mut apis = Vec::new();

        while let Some(row) = rows.next()? {
            let na: u32 = row.get("address")?;
            let mask: u8 = row.get("netmask")?;
            let name: String = row.get("name")?;
            let mtu: u32 = row.get("mtu")?;
            let privkey: Vec<u8> = row.get("privatekey")?;
            let privkey: [u8; 32] = privkey.try_into().unwrap();
            //let pubkey: Vec<u8> = row.get("pubkey")?;
            //let pubkey: [u8; 32] = pubkey.try_into().unwrap();
            let port = row.get("listenport")?;

            let v: String = row.get("users")?;
            let users: Vec<PeerDbConfig> = serde_json::from_str(&v)?;
            let mut peers = Vec::new();

            let wg = WGApi::<Userspace>::new(&name).unwrap();

            //wg.create_interface().unwrap();

            for user in users.iter() {
                let secret: [u8; 32] = user.privatekey.clone().try_into().unwrap();
                let secret = StaticSecret::from(secret);

                let key = PublicKey::from(&secret);
                let peer_key: Key = key.as_ref().try_into().unwrap();
                let mut peer = Peer::new(peer_key);
                let addr = IpAddrMask::new(IpAddr::V4(Ipv4Addr::from(na)), mask);
                peer.allowed_ips.push(addr);
                peers.push(peer);
                //wg.configure_peer(&peer);
            }

            wg.configure_interface(&InterfaceConfiguration {
                name: name,
                prvkey: convert_key(privkey),
                addresses: vec![],
                port: port,
                peers,
                mtu: Some(mtu),
                fwmark: None,
            })
            .unwrap();

            let host = wg.read_interface_data().unwrap();
            println!("WireGuard configuration: {host:#?}");

            apis.push(wg);
        }

        //debug!("{}", apis);

        Ok(Self { apis })
    }

    pub fn start(&mut self) {
        for a in self.apis.iter_mut() {
            a.create_interface().unwrap();
        }
    }

    pub fn stop(&mut self) {
        for a in self.apis.iter_mut() {
            a.remove_interface().unwrap();
        }
    }
}
