import { Database } from "@db/sqlite";
import { Hono } from "hono";
import { getInterfaceAndUserByInterfaceId } from "./Interfaces.ts";
import { IPv4 } from "ip-num";

export const collectExportData = (db: Database) => {
    const interfaces = db
        .prepare(`SELECT id FROM interfaces`)
        .all();

        return interfaces.map((i) => {
            return getInterfaceAndUserByInterfaceId(db, i.id, true)
        })
}

const writeOutWireguardConfig = (d: any) => {
    const wireguard_config = `[Interface]
Address = ${new IPv4(d.address).toString()}/${d.netmask}
ListenPort = ${d.port}
PrivateKey = ${d.privatekey.trim()}
MTU = 1420
Table = off
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

${d.users.map(v => {
    return `# ${v.name}
[Peer]
PublicKey = ${v.pubkey}
PresharedKey = ${v.psk.trim()}
AllowedIPs = ${new IPv4(v.address).toString()}`
})}
`
    return wireguard_config
}

export const writeOutWireguardClientConfig = (d: any) => {
    console.log(d);
    return `[Interface]
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
}

function writeToFile(path: string, data: string) {
    Deno.writeTextFileSync(path, data, { create: true, append: false });
}

export const ConfigRoutes = (db: Database) => {
    const route = new Hono();

    route.get("/export", (c) => {
        collectExportData(db).forEach((v) => {
            console.log("export", v)
            const conf = writeOutWireguardConfig(v);
            writeToFile("./output/wireguard/"+v.name+".conf", conf) 
        })

        //console.log(server_config);

        /*server_config.forEach(v => {
            console.log(v);
        });*/


        return c.text("ok")
    })

    return route;
}