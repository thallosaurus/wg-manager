use std::{
    io::{self, Write},
    process::{Command, Stdio},
};

use crate::messages::InterfaceConfig;

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

struct WireguardInterface {
    config: Option<InterfaceConfig>
}

struct WireguardInterfaceManager {
    interface_names: Vec<String>
}

impl WireguardInterfaceManager {
    pub fn init() -> io::Result<Self> {
        Ok(Self {
            interface_names: wg_get_interfaces()?
        })
    }
}

impl Iterator for WireguardInterfaceManager {
    type Item = WireguardInterface;

    fn next(&mut self) -> Option<Self::Item> {

    }
}