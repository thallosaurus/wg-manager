import { Database } from "@db/sqlite";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { generatePrivkey, generatePsk, generatePubkey } from "../utils.ts";
import { IPv4 } from "ip-num";

interface UserCreationRequest {
    interfaceId: number,
    name: string,
    pubkey: string,
    privkey: string,
    psk: string,
    ip: number
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

    router.delete("/:user", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);

        return c.json({ userId, interfaceId })
    })

    return router;
}