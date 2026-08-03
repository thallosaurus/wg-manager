import type { WgmdMessages, WgmdAnswer } from "./wgmd/main.ts";

const conn = await Deno.connect({ transport: "unix", path: "/var/run/wgmd.sock"})

export async function sendMessage(m: WgmdMessages): Promise<WgmdAnswer> {
    const encoder = new TextEncoder();
    conn.write(encoder.encode(JSON.stringify(m) + "\n"));

    const buf = new Uint8Array(1000);
    const b = await conn.read(buf);
    const decoder = new TextDecoder();
    const s = decoder.decode(buf.subarray(0, b!));
    return JSON.parse(s);
}

const n: WgmdMessages = {
    "type": "add_user",
    "address": "172.16.0.2",
    "interface_id": 1 as unknown as bigint,
    "username": "lenna"
}

const m: WgmdMessages = {
    "type": "add_interface",
    "address": "172.16.0.1",
    "endpoint": "vpn.example.net",
    "if_name": "test1",
    "mtu": 1420,
    "port": 42069,
    "subnet": 24
}

const q: WgmdMessages = {
    "type": "interfaces"
};
const e: WgmdMessages = {
    "type": "export"
};

const r = await sendMessage(e)
console.log(r)
if (r.success) {
    console.log("ok");
} else {
    console.log("not ok")
}