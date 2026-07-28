import { Database } from "@db/sqlite";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { generatePrivkey, generatePsk, generatePubkey } from "../utils.ts";

interface UserCreationRequest {
    name: string,
    pubkey: string,
    privkey: string,
    psk: string
}

const assignUserToInterface = (
    db: Database,
    userId: number,
    interfaceId: number
) => {
    db.prepare(
        `INSERT INTO interfaces_users (interface_id, user_id) VALUES (?, ?)`
    ).run(
        userId,
        interfaceId
    )
}

const createUserCreationRequest = async (data: FormData): Promise<UserCreationRequest> => {
    if (!data.has("name")) throw new HTTPException(401, { message: "missing name" })

    const name = data.get("name")!;

    const privkey = await generatePrivkey();
    const pubkey = await generatePubkey(privkey);
    const psk = await generatePsk();

    return {
        name: name as string,
        privkey,
        pubkey,
        psk
    }
}
const createFromRequest = (db: Database, req: UserCreationRequest) => {
    return db.prepare(
        `INSERT INTO users (name, publicKey, psk, privateKey) VALUES (?, ?, ?, ?)`
    ).run(
        req.name,
        req.pubkey,
        req.psk,
        req.privkey
    )
}

export const UsersApi = (db: Database) => {
    const router = new Hono();
    router.post("/", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        let id;
        db.transaction(async () => {
            const req = await createUserCreationRequest(await c.req.formData())
            id = createFromRequest(db, req);
            assignUserToInterface(db, id, interfaceId);
        });
        
        return c.json({ id })
    })
    return router;
}