use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct UserConfig {
    name: String,
    public_key: String,
    psk: String,
    address: u32
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
pub struct InterfaceConfig {
    address: u32,
    port: u16,
    private_key: String,
    //mtu: u16,
    users: Vec<UserConfig>
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "messages.ts")]
#[serde(tag = "type")]
pub enum WgmdMessages {
    #[serde(rename = "add_interface")]
    UpdateInterface {
        if_name: String,
        config: InterfaceConfig
    },
    #[serde(rename = "remove_interface")]
    RemoveInterface {
        if_name: String
    }
}