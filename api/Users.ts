import { Database } from "@db/sqlite";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { generatePrivkey, generatePsk, generatePubkey } from "../utils.ts";
import { IPv4 } from "ip-num";
import { writeOutWireguardClientConfig } from "./Config.ts";

interface UserCreationRequest {
    interfaceId: number,
    name: string,
    pubkey: string,
    privkey: string,
    psk: string,
    ip: number
}

const USER_QUERY_PRIVKEY = `SELECT u.allowed_ip, u.privateKey, i.pubkey as hostPubkey, u.publicKey as userPubkey, u.psk, i.endpoint, i.listenport
        FROM users u
        LEFT JOIN interfaces i ON u.interface_id = i.id
        WHERE u.interface_id = ? AND u.id = ?`

const USER_QUERY = `SELECT u.allowed_ip, u.publicKey as userPubkey, i.endpoint, i.listenport
        FROM users u
        LEFT JOIN interfaces i ON u.interface_id = i.id
        WHERE u.interface_id = ? AND u.id = ?`

const getUserFromInterface = (db: Database, interfaceId: number, userId: number, fetchKeys = false) => {
    
    if (fetchKeys) {
        const r = db.prepare(USER_QUERY_PRIVKEY).get(interfaceId, userId)!
        return {
            ip: r.allowed_ip >>> 0,
            clientPrivkey: r.privateKey.trim(),
            hostPubkey: r.hostPubkey.trim(),
            clientPubkey: r.userPubkey.trim(),
            psk: r.psk.trim(),
            endpoint: r.endpoint,
            port: r.listenport
        }
    } else {
        const r = db.prepare(USER_QUERY).get(interfaceId, userId)!
        return {
            ip: r.allowed_ip >>> 0,
            clientPubkey: r.userPubkey.trim(),
            endpoint: r.endpoint,
            port: r.listenport
        }

    }
}

const createUserCreationRequest = async (interfaceId: number, data: FormData): Promise<UserCreationRequest> => {
    if (!data.has("name")) throw new HTTPException(401, { message: "missing name" })
    const name = data.get("name")!;

    if (!data.has("ip")) throw new HTTPException(401, { message: "missing client ip" })
    const ip = new IPv4(data.get("ip")! as string);

    const privkey = await generatePrivkey();
    const pubkey = await generatePubkey(privkey);
    const psk = await generatePsk();

    return {
        name: name as string,
        privkey,
        pubkey,
        psk,
        interfaceId,
        ip: Number(ip.getValue())
    }
}
const createFromRequest = (db: Database, req: UserCreationRequest) => {
    db.prepare(
        `INSERT INTO users (interface_id, name, allowed_ip, publicKey, psk, privateKey) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
        req.interfaceId,
        req.name,
        req.ip,
        req.pubkey,
        req.psk,
        req.privkey
    )

    return db.lastInsertRowId
}


export const UsersApi = (db: Database) => {
    const router = new Hono();
    router.get("/:user", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);
        console.log(userId, interfaceId)
        return c.json(getUserFromInterface(db, interfaceId, userId, false))
    })
    router.post("/", async (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const formData = await c.req.formData();
        const req = await createUserCreationRequest(interfaceId, await c.req.formData())
        try {

            const userId = createFromRequest(db, req);

            const redirect = formData.has("redirect") ? ((formData.get("redirect") as string) + interfaceId) : ("api/interface/" + interfaceId)

            c.status(201)
            return c.redirect(redirect)
        } catch (e: any) {
            throw new HTTPException(401, { message: e.message })
        }
    })

    router.get("/:user/client", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);
        console.log(userId, interfaceId)
        const data = getUserFromInterface(db, interfaceId, userId, true)
        return c.text(writeOutWireguardClientConfig(data))
    })

    router.delete("/:user", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);

        return c.json({ userId, interfaceId })
    })

    return router;
}