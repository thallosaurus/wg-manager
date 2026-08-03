use std::{io::{self, Write}, process::{Command, Stdio}};

pub fn wg_make_pubkey(pkey: &Vec<u8>) -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["pubkey"], Some(pkey))
}

pub fn wg_make_privkey() -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["genkey"], None)
}

pub fn wg_make_psk() -> io::Result<Vec<u8>> {
    run_cmd_stdin("wg", &["genpsk"], None)
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