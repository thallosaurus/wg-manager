import { WgmdMessages } from "./wgmd/main.ts";

const conn = await Deno.connect({ transport: "unix", path: "/var/folders/kz/0yk0763n6jv3bhqv3h5vgk9h0000gn/T/.tmpxxPCuk/wgmd.sock"})

export async function sendMessage(m: WgmdMessages): Promise<{
    success: boolean
}> {
    const encoder = new TextEncoder();
    conn.write(encoder.encode(JSON.stringify(m) + "\n"));

    const buf = new Uint8Array(100);
    const b = await conn.read(buf);
    const decoder = new TextDecoder();
    const s = decoder.decode(buf.subarray(0, b!));
    return JSON.parse(s);
}

const r = await sendMessage({
    "if_name": "wg0",
    "type": "add_interface",
    "config": {
        "address": 12345,
        "port": 42069,
        "private_key": "privkey",
        "users": [
            {
                "address": 12346,
                "name": "lenna",
                "psk": "psk",
                "public_key": "pubkey"
            }
        ]
    }
})
if (r.success) {
    console.log("ok");
} else {
    console.log("not ok")
}