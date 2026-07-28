import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception';

import { Database } from "@db/sqlite";
import { UsersApi } from "./Users.ts";
import { generatePrivkey } from "../utils.ts";

export interface InterfaceCreationRequest {
    name: string,
    address: string,
    endpoint: string,
    mtu: number,
    privateKey: string,
    netmask: number
}

const getMinimalinterfaceList = (db: Database) => {
    return db
        .prepare("SELECT id, name, address FROM interfaces")
        .all()
}

const createFromRequest = (db: Database, req: InterfaceCreationRequest) => {
    db.prepare(
        `INSERT INTO interfaces (name, address, endpoint, privatekey, mtu, netmask) VALUES (?, ?, ?, ?, ?, ?);`,
    ).run(
        req.name,
        req.address,
        req.endpoint,
        req.privateKey,
        req.mtu,
        req.netmask
    );

    return db.lastInsertRowId
}

const createCreationRequest = async (data: FormData): Promise<InterfaceCreationRequest> => {
    if (!data.has("name")) throw new HTTPException(401, { message: "missing name" })
    const name = data.get("name")!;
    if (!data.has("address")) throw new HTTPException(401, { message: "missing address" })
    const address = data.get("address")!;
    if (!data.has("endpoint")) throw new HTTPException(401, { message: "missing endpoint" })
    const endpoint = data.get("endpoint")!;

    if (!data.has("netmask")) throw new HTTPException(401, { message: "missing netmask" })
    const netmask = parseInt(data.get("netmask")! as string);

    const mtu = 1420;
    const privateKey = await generatePrivkey();

    return {
        name: name as string,
        address: address as string,
        endpoint: endpoint as string,
        mtu,
        privateKey,
        netmask
    }
}

export const getInterfaceAndUserByInterfaceId = (db: Database, id: number) => {
    return db
        .prepare(`
                SELECT
                    i.id,
                    i.name,
                    i.address,
                    json_group_array(
                        json_object(
                            'id', u.id,
                            'name', u.name
                        )
                    ) FILTER (WHERE u.id IS NOT NULL) AS users

                FROM interfaces i
                LEFT JOIN users u ON u.interface_id = i.id
                WHERE i.id = ?
                GROUP BY i.id;
            `)
        .get(id)
}

export const InterfaceApi = (db: Database) => {
    const app = new Hono();

    app.get("/", (c) => {
        const rows = getMinimalinterfaceList(db);
        return c.json(rows);
    });

    app.post("/", async (c) => {
        const data = await c.req.formData();
        const request = await createCreationRequest(data);
        const id = createFromRequest(db, request);

        c.status(201);

        return c.redirect("api/" + id)

        //        return c.json(getInterfaceAndUserByInterfaceId(db, id));
    })

    app.get("/:id", (c) => {
        const id = parseInt(c.req.param("id"));
        const rows = getInterfaceAndUserByInterfaceId(db, id);

        return c.json(rows);
    })

    app.route("/:id", UsersApi(db))

    return app;
}