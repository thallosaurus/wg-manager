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

const writeOutExport = (d: any) => {
    console.log(d);
    const wireguard_config = `[Interface]
Address = ${new IPv4(d.address).toString()}/${d.netmask}
ListenPort = ${d.port}
PrivateKey = ${d.privatekey.trim()}
MTU = 1420

${d.users.map(v => {
    return `# ${v.name}
[Peer]
PublicKey = ${v.pubkey}
PresharedKey = ${v.psk.trim()}
AllowedIPs = ${new IPv4(v.address).toString()}
`
})}
    `
    return wireguard_config
}

export const ConfigRoutes = (db: Database) => {
    const route = new Hono();

    route.get("/export", (c) => {
        return c.text(collectExportData(db).map((v) => {
            return writeOutExport(v);
        }).join(""))
    })

    return route;
}