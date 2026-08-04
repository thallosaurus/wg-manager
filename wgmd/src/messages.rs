use core::fmt;
use std::{fmt::Write, format, fs, net::Ipv4Addr, writeln};

use ipnet::Ipv4Net;
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::debug;
use ts_rs::TS;

use crate::interfaces::{wg_make_privkey, wg_make_psk, wg_make_pubkey, wg_quick_down, wg_quick_up};

#[derive(Serialize, Deserialize, Debug, Clone)]
//#[ts(export, export_to = "messages.ts")]
pub struct PrivateUserConfig {
    name: String,
    pubkey: String,
    hostPubkey: String,
    privkey: String,
    psk: String,
    address: u32,
    endpoint: String,
    listenport: u16
}

impl PrivateUserConfig {
    pub fn to_wireguard_config(&self) -> String {
        let mut c = String::new();
        writeln!(c, "[Interface]");
        /*
        Address = ${new IPv4(d.ip).toString()}/32
ListenPort = 54654
PrivateKey = ${d.clientPrivkey}
MTU = 1420
DNS = dns address

[Peer]
PublicKey = ${d.hostPubkey}
PresharedKey = ${d.psk}
AllowedIPs = ${new IPv4(d.ip).toString()}/32
PersistentKeepalive = 30
Endpoint = ${d.endpoint}:${d.port}`
         */
        c
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
//#[ts(export, export_to = "messages.ts")]
pub struct UserConfig {
    name: String,
    pubkey: String,
    psk: String,
    address: u32,
}

#[derive(Serialize, Deserialize, Debug)]
//#[ts(export, export_to = "messages.ts")]
pub struct InterfaceConfig {
    id: i64,
    if_name: String,
    address: Ipv4Addr,
    //netaddress: Ipv4Addr,
    port: u16,
    subnet: u8,
    mtu: u16,
    private_key: String,
    public_key: String,
    endpoint: String,
    users: Vec<UserConfig>,
}

impl InterfaceConfig {
    pub fn to_wireguard_config(&self) -> Result<String, fmt::Error> {
        let mut c = String::new();

        writeln!(c, "[Interface]")?;
        writeln!(c, "Address = {}/{}", self.address, self.subnet)?;
        writeln!(c, "ListenPort = {}", self.port)?;
        writeln!(c, "PrivateKey = {}", self.private_key.trim())?;
        writeln!(c, "MTU = {}", self.mtu)?;
        writeln!(c, "Table = off")?;
        writeln!(c, "PostUp = iptables -A FORWARD -i %i -j ACCEPT")?;
        writeln!(
            c,
            "PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE"
        )?;
        writeln!(c, "PostDown = iptables -D FORWARD -i %i -j ACCEPT")?;
        writeln!(
            c,
            "PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE"
        )?;

        for u in self.users.clone() {
            let ip = Ipv4Addr::from(u.address);
            writeln!(c, "# {}", u.name)?;
            writeln!(c, "[Peer]")?;
            writeln!(c, "PublicKey = {}", u.pubkey.trim())?;
            writeln!(c, "PresharedKey = {}", u.psk.trim())?;
            writeln!(c, "AllowedIPs = {}", ip.to_string())?;
            writeln!(c, "")?;
        }
        Ok(c)
    }
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct PublicUserConfig {
    id: i64,
    name: String,
    address: Ipv4Addr,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct PublicInterfaceConfig {
    id: i64,
    name: String,
    netaddress: Ipv4Addr,
    listenport: u16,
    netmask: u8,
    users: Vec<PublicUserConfig>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
#[serde(tag = "type")]
pub enum WgmdMessages {
    #[serde(rename = "remove_interface")]
    RemoveInterface(RemoveInterfaceRequest),

    #[serde(rename = "add_interface")]
    AddInterface(AddInterfaceRequest),

    #[serde(rename = "add_user")]
    AddUser(AddUserRequest),

    #[serde(rename = "remove_user")]
    RemoveUser(RemoveUserRequest),

    #[serde(rename = "interfaces")]
    QueryAllInterfaces,

    #[serde(rename = "query_interface")]
    QueryInterface(QueryInterface),

    #[serde(rename = "query_user")]
    QueryUser(QueryUser),

    #[serde(rename = "export")]
    Export,

    #[serde(rename = "export_client")]
    ExportClient(ExportClientRequest)
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
struct ExportClientRequest {
    interface_id: i64,
    user_id: i64
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct QueryUser {
    user_id: i64,
    interface_id: i64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct QueryInterface {
    id: i64,
}
#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(tag = "type")]
#[ts(export, export_to = "messages.ts")]
pub enum WgmdAnswer {
    #[serde(rename = "interfaces")]
    QueryAllInterfaces(QueryAllInterfacesAnswer),

    #[serde(rename = "query_interface")]
    QuerySingleInterface(QuerySingleInterfaceAnswer),

    #[serde(rename = "add_interface")]
    AddInterfaceId(CreateAnswer),

    #[serde(rename = "add_user")]
    AddUserId(CreateAnswer),

    #[serde(rename = "query_user")]
    QuerySingleUser(QuerySingleUserAnswer),

    #[serde(rename = "status")]
    Status { status: bool },
    
    #[serde(rename = "client_cert")]
    ClientExport { data: String }
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct CreateAnswer {
    data: i64
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct QueryAllInterfacesAnswer {
    data: Vec<PublicInterfaceConfig>
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct QuerySingleUserAnswer {
    data: PublicUserConfig
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct QuerySingleInterfaceAnswer {
    data: PublicInterfaceConfig
}

pub fn process_message(m: WgmdMessages, db: &Connection) -> WgmdAnswer {
    debug!("{:?}", m);

    match m {
        WgmdMessages::RemoveInterface(req) => {
            delete_interface(req, db).unwrap();
            WgmdAnswer::Status { status: true }
        }
        WgmdMessages::AddInterface(req) => {
            let id = insert_interface(req, db).unwrap();
            WgmdAnswer::AddInterfaceId(CreateAnswer { data: id })
        }
        WgmdMessages::QueryAllInterfaces => {
            let rows = get_all_interfaces_public(db).unwrap();
            WgmdAnswer::QueryAllInterfaces(QueryAllInterfacesAnswer { data: rows })
        }
        WgmdMessages::QueryInterface(id) => {
            let r = get_single_interface_public(id.id, db).unwrap();
            //println!("{:?}", r);
            if let Some(row) = r {
                WgmdAnswer::QuerySingleInterface(QuerySingleInterfaceAnswer { data: row })
            } else {
                WgmdAnswer::Status { status: false }
            }
        }
        WgmdMessages::AddUser(req) => {
            let id = add_user_to_interface(req, db).unwrap();
            WgmdAnswer::AddUserId(CreateAnswer { data: id })
        }
        WgmdMessages::RemoveUser(req) => {
            remove_user_from_interface(req, db).unwrap();
            WgmdAnswer::Status { status: true }
        }
        WgmdMessages::QueryUser(q) => {
            let data = query_user(q, db).unwrap();
            WgmdAnswer::QuerySingleUser(QuerySingleUserAnswer { data })
        }
        WgmdMessages::Export => {
            let r = get_all_interfaces_private(db).unwrap();
            println!("{:?}", r);

            for c in r {
                let _ = wg_quick_down(&c.if_name);

                fs::write(
                    format!("/etc/wireguard/{}.conf", c.if_name),
                    c.to_wireguard_config().unwrap(),
                )
                .unwrap();
                wg_quick_up(&c.if_name).unwrap();
            }
            WgmdAnswer::Status { status: true }
        }
        WgmdMessages::ExportClient(export_client_request) => {
            let query = query_user_private(QueryUser { user_id: export_client_request.user_id, interface_id: export_client_request.interface_id }, db).unwrap();
            WgmdAnswer::ClientExport { data: query.to_wireguard_config() }
        },
            }
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct AddUserRequest {
    interface_id: i64,
    username: String,
    address: Ipv4Addr,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct RemoveUserRequest {
    interface_id: i64,
    user_id: i64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct AddInterfaceRequest {
    if_name: String,
    address: Ipv4Addr,
    endpoint: String,
    mtu: u16,
    subnet: u8,
    port: u16,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct RemoveInterfaceRequest {
    id: i64,
}

fn insert_interface(conf: AddInterfaceRequest, db: &Connection) -> Result<i64, rusqlite::Error> {
    let private_key = wg_make_privkey().unwrap();
    let public_key = wg_make_pubkey(&private_key).unwrap();
    let netaddress = Ipv4Net::new(conf.address, conf.subnet).unwrap();

    db.execute(
        "INSERT INTO interfaces (name, address, endpoint, privatekey, pubkey, mtu, netmask, netaddress, broadcast, listenport) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        (
            conf.if_name,
            u32::from(conf.address),
            conf.endpoint,
            String::from_utf8(private_key).unwrap().trim(),
            String::from_utf8(public_key).unwrap().trim(),
            conf.mtu,
            conf.subnet,
            u32::from(netaddress.network()),
            u32::from(netaddress.broadcast()),
            conf.port
    )
    )?;

    Ok(db.last_insert_rowid())
}

fn get_all_interfaces_private(db: &Connection) -> Result<Vec<InterfaceConfig>, rusqlite::Error> {
    let mut stmt =
        db.prepare("SELECT id, name, address, listenport, netmask, privatekey, pubkey, mtu, endpoint, users FROM InterfaceConfigsKeys")?;
    let mut rows = stmt.query(())?;
    let mut result: Vec<InterfaceConfig> = Vec::new();

    while let Some(row) = rows.next()? {
        let na: i64 = row.get_unwrap("address");
        let v: String = row.get_unwrap("users");
        let privkey: String = row.get_unwrap("privatekey");
        let pubkey: String = row.get_unwrap("pubkey");
        result.push(InterfaceConfig {
            id: row.get_unwrap("id"),
            if_name: row.get_unwrap("name"),
            address: Ipv4Addr::from(na as u32),
            port: row.get_unwrap("listenport"),
            subnet: row.get_unwrap("netmask"),
            mtu: row.get_unwrap("mtu"),
            private_key: privkey.trim().to_string(),
            public_key: pubkey.trim().to_string(),
            endpoint: row.get_unwrap("endpoint"),
            users: serde_json::from_str(&v).unwrap(),
        });
    }

    Ok(result)
}

pub fn get_all_interfaces_public(
    db: &Connection,
) -> Result<Vec<PublicInterfaceConfig>, rusqlite::Error> {
    let mut stmt = db.prepare(
        "SELECT id, name, address, listenport, netmask, endpoint, users FROM InterfaceConfigs",
    )?;
    let mut rows = stmt.query(())?;

    let mut result: Vec<PublicInterfaceConfig> = Vec::new();

    while let Some(row) = rows.next()? {
        let na: i64 = row.get_unwrap("address");
        let users: String = row.get_unwrap("users");

        let u: Vec<Value> = serde_json::from_str(&users).unwrap();
        let u = u
            .iter()
            .map(|v| {
                let id = v.get("id").unwrap().as_i64().unwrap();
                let name = v.get("name").unwrap().as_str().unwrap();
                let address = v.get("address").unwrap().as_u64().unwrap() as u32;
                PublicUserConfig {
                    id,
                    name: String::from(name),
                    address: Ipv4Addr::from(address),
                }
            })
            .collect();

        result.push(PublicInterfaceConfig {
            id: row.get_unwrap("id"),
            name: row.get_unwrap("name"),
            netaddress: Ipv4Addr::from(na as u32),
            listenport: row.get_unwrap("listenport"),
            netmask: row.get_unwrap("netmask"),
            users: u,
        });
    }
    Ok(result)
}

pub fn get_single_interface_public(
    id: i64,
    db: &Connection,
) -> Result<Option<PublicInterfaceConfig>, rusqlite::Error> {
    let mut stmt = db.prepare(
        "SELECT name, address, listenport, netmask, users FROM InterfaceConfigs WHERE id = ?",
    )?;
    let mut rows = stmt.query((id,))?;
    let r = rows.next().unwrap();
    if let Some(row) = r {
        let na: i64 = row.get_unwrap("address");
        let users: String = row.get_unwrap("users");

        let u: Vec<Value> = serde_json::from_str(&users).unwrap();
        let u = u
            .iter()
            .map(|v| {
                let id = v.get("id").unwrap().as_i64().unwrap();
                let name = v.get("name").unwrap().as_str().unwrap();
                let address = v.get("address").unwrap().as_u64().unwrap() as u32;
                PublicUserConfig {
                    id,
                    name: String::from(name),
                    address: Ipv4Addr::from(address),
                }
            })
            .collect();

        Ok(Some(PublicInterfaceConfig {
            id,
            name: row.get_unwrap("name"),
            netaddress: Ipv4Addr::from(na as u32),
            listenport: row.get_unwrap("listenport"),
            netmask: row.get_unwrap("netmask"),
            users: u,
        }))
    } else {
        Ok(None)
    }
}

fn delete_interface(conf: RemoveInterfaceRequest, db: &Connection) -> Result<(), rusqlite::Error> {
    db.execute("DELETE FROM interfaces WHERE id = ?", (conf.id,))?;
    Ok(())
}

fn add_user_to_interface(conf: AddUserRequest, db: &Connection) -> Result<i64, rusqlite::Error> {
    //let if_priv = get_interface_private_key(conf.interface_id, db)?;
    let client_privkey = wg_make_privkey().unwrap();
    let client_pubkey = wg_make_pubkey(&client_privkey).unwrap();
    let client_psk = wg_make_psk().unwrap();

    db.execute("INSERT INTO users (interface_id, name, allowed_ip, publicKey, psk, privateKey) VALUES (?, ?, ?, ?, ?, ?)", (
        conf.interface_id,
        conf.username,
        u32::from(conf.address),
        String::from_utf8(client_pubkey).unwrap(),
        String::from_utf8(client_privkey).unwrap(),
        String::from_utf8(client_psk).unwrap(),
    ))?;
    Ok(db.last_insert_rowid())
}

fn remove_user_from_interface(
    conf: RemoveUserRequest,
    db: &Connection,
) -> Result<(), rusqlite::Error> {
    db.execute(
        "DELETE FROM users WHERE interface_id = ? AND id = ?",
        (conf.interface_id, conf.user_id),
    )?;
    Ok(())
}

fn query_user(q: QueryUser, db: &Connection) -> Result<PublicUserConfig, rusqlite::Error> {
    db.query_one("SELECT u.allowed_ip as address, u.name, u.publicKey as userPubkey, i.endpoint, i.listenport FROM users u LEFT JOIN interfaces i ON u.interface_id = i.id WHERE u.interface_id = ? AND u.id = ?",
    (q.interface_id, q.user_id), |row| {
        let addr: u32 = row.get_unwrap("address");
        Ok(PublicUserConfig {
            id: q.user_id,
            name: row.get_unwrap("name"),
            address: Ipv4Addr::from(addr),
        })
    })
}

fn query_user_private(q: QueryUser, db: &Connection) -> Result<PrivateUserConfig, rusqlite::Error> {
    db.query_one("SELECT u.allowed_ip as address, u.privateKey, i.pubkey as hostPubkey, u.publicKey as userPubkey, u.psk, i.endpoint, i.listenport FROM users u LEFT JOIN interfaces i ON u.interface_id = i.id WHERE u.interface_id = ? AND u.id = ?",
    (q.interface_id, q.user_id), |row| {
        let addr: u32 = row.get_unwrap("address");
        Ok(PrivateUserConfig {
            //id: q.user_id,
            name: row.get_unwrap("name"),
            address: addr as u32,
            pubkey: row.get_unwrap("userPubkey"),
            hostPubkey: row.get_unwrap("hostPubkey"),
            psk: row.get_unwrap("psk"),
            privkey: row.get_unwrap("privatekey"),
            endpoint: row.get_unwrap("endpoint"),
            listenport: row.get_unwrap("listenport"),
        })
    })
}

#[cfg(test)]
mod tests {
    use std::net::Ipv4Addr;

    use crate::messages::{
        AddInterfaceRequest, AddUserRequest, RemoveInterfaceRequest, add_user_to_interface,
        delete_interface, get_single_interface_public, insert_interface,
    };
    use rusqlite::Connection;

    const DB_QUERY: &str = include_str!("../database.sql");

    fn debug_database() -> Connection {
        let db = Connection::open(":memory:").unwrap();
        db.execute_batch(DB_QUERY).unwrap();
        db
    }

    #[test]
    fn test_interface_adding() {
        let db = debug_database();
        let id = insert_interface(
            AddInterfaceRequest {
                if_name: "test0".to_string(),
                address: Ipv4Addr::new(172, 16, 0, 1),
                endpoint: "vpn.example.net".to_string(),
                mtu: 1420,
                subnet: 24,
                port: 12346,
            },
            &db,
        );
        assert!(id.is_ok());

        //let r = delete_interface(RemoveInterfaceRequest { id: id.unwrap() }, &db);
        //assert!(r.is_ok());
    }

    #[test]
    fn test_interface_query() {
        let db = debug_database();
        let id = insert_interface(
            AddInterfaceRequest {
                if_name: "test0".to_string(),
                address: Ipv4Addr::new(172, 16, 0, 1),
                endpoint: "vpn.example.net".to_string(),
                mtu: 1420,
                subnet: 24,
                port: 12346,
            },
            &db,
        );
        assert!(id.is_ok());
        let id = id.unwrap();

        let id2 = insert_interface(
            AddInterfaceRequest {
                if_name: "test1".to_string(),
                address: Ipv4Addr::new(172, 17, 0, 1),
                endpoint: "vpn.example.net".to_string(),
                mtu: 1420,
                subnet: 24,
                port: 12347,
            },
            &db,
        );
        assert!(id2.is_ok());
        let id2 = id2.unwrap();

        let query = get_single_interface_public(id, &db).unwrap();
        assert!(query.is_some());
        let query = query.unwrap();
        assert_eq!(query.id, id);
        assert_eq!(query.netaddress, Ipv4Addr::new(172, 16, 0, 1));

        let query = get_single_interface_public(id2, &db).unwrap();
        assert!(query.is_some());
        let query = query.unwrap();
        assert_eq!(query.id, id2);
        assert_eq!(query.netaddress, Ipv4Addr::new(172, 17, 0, 1));
    }

    #[test]
    fn test_interface_removal() {
        let db = debug_database();
        let id = insert_interface(
            AddInterfaceRequest {
                if_name: "test0".to_string(),
                address: Ipv4Addr::new(172, 16, 0, 1),
                endpoint: "vpn.example.net".to_string(),
                mtu: 1420,
                subnet: 24,
                port: 12346,
            },
            &db,
        );
        assert!(id.is_ok());

        let r = delete_interface(RemoveInterfaceRequest { id: id.unwrap() }, &db);
        assert!(r.is_ok());
    }

    #[test]
    fn test_user_adding() {
        let db = debug_database();
        let id = insert_interface(
            AddInterfaceRequest {
                if_name: "test0".to_string(),
                address: Ipv4Addr::new(172, 16, 0, 1),
                endpoint: "vpn.example.net".to_string(),
                mtu: 1420,
                subnet: 24,
                port: 12346,
            },
            &db,
        );
        assert!(id.is_ok());
        let id = id.unwrap();

        let user_id = add_user_to_interface(
            AddUserRequest {
                interface_id: id,
                username: "testuser".to_string(),
                address: Ipv4Addr::new(172, 16, 0, 2),
            },
            &db,
        );
        assert!(user_id.is_ok());

        let query = get_single_interface_public(id, &db).unwrap();
        assert!(query.is_some());
        let query = query.unwrap();
        assert_eq!(query.users.len(), 1);
        //assert_eq!(query.id, id);
        //assert_eq!(query.netaddress, Ipv4Addr::new(172, 16, 0, 1));
    }
}
