import subprocess
from pathlib import Path
from argparse import ArgumentParser

parser = ArgumentParser(prog="Wireguard User Adder")
parser.add_argument("interfacename")
parser.add_argument("clientname")
parser.add_argument("clientaddr")
parser.add_argument("--restart-wireguard", default=False)
args = parser.parse_args()

ifname = args.interfacename
clientname = args.clientname
clientaddr = args.clientaddr

def append(path: str | Path, text: str) -> None:
  Path(path).open("a", encoding="utf-8").write(text)

def write(path: str | Path, text: str) -> None:
  Path(path).open("w", encoding="utf-8").write(text)

def read_file(path: str | Path) -> str:
  return Path(path).read_text(encoding="utf-8")

def run(cmd: list[str], input: str | None = None) -> str:
  result = subprocess.run(
    cmd,
    input=input,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    check=True,
  )
  return result.stdout.strip()

# read host keys in
host_pubkey = read_file(f"/etc/wireguard/{ifname}.pub")

# generate client keys and psk
client_privkey = run(["wg", "genkey"])
client_pubkey = run(["wg", "pubkey"], input=client_privkey)
psk = run(["wg", "genpsk"])

#consolidate into config
client_config = f"""
[Interface]
Address = 172.31.0.4/32
ListenPort = 54654
PrivateKey = {client_privkey.strip()}
MTU = 1420
DNS = 172.31.0.1

[Peer]
PublicKey = {host_pubkey.strip()}
PresharedKey = {psk.strip()}
AllowedIPs = 172.31.0.0/16
PersistentKeepalive = 30
Endpoint = vmd187505.contaboserver.net:42069
"""

server_config = f"""\
# {clientname}
[Peer]
PublicKey = {client_pubkey.strip()}
PresharedKey = {psk.strip()}
AllowedIPs = {clientaddr}/32
"""

dnsmasq_conf = f"address=/{clientname}.lbtm-x-htw.internal/{clientaddr}"

#write to config
#run(["tee", "wg0.conf"], input=server_config + "\n")
#run(["tee", f"{clientname}_client.conf"], input=client_config)
write(f"{clientname}_client.conf", client_config)
append(f"/etc/wireguard/{ifname}.conf", server_config)
write(f"/etc/dnsmasq.d/wireguard-{clientname}.conf", dnsmasq_conf)
run(["systemctl", "restart", "dnsmasq"])

if args.restart_wireguard:
  run(["systemctl", "restart", f"wg-quick@{ifname}.service"])
else:
  print(f"Skipping \"systemctl restart wg-quick@{ifname}.service\" as this can cause disruption of your current Terminal session")
  print("Next time, run again with \"--restart-wireguard\" to automatically restart the specified interface")
