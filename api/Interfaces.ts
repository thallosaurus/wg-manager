import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception';

import { Database } from "@db/sqlite";
import { UsersApi } from "./Users.ts";
import { generatePrivkey, generatePubkey } from "../utils.ts";
import { IPv4, IPv4CidrRange } from "ip-num";
import { sendMessage } from "../socket.ts";

export interface InterfaceCreationRequest {
    name: string,
    address: number,
    endpoint: string,
    mtu: number,
    privateKey: string,
    pubkey: string,
    netmask: number
    netaddress: number,
    broadcast: number,
    port: number
}

export interface MinimalInterfaceConfig {
    id: number,
    name: string,
    address: number
}

export const getMinimalinterfaceList = (db: Database): MinimalInterfaceConfig[] => {
    const r = db
        .prepare("SELECT id, name, address FROM interfaces")
        .all()

    return r.map((v, i) => {
        return {
            id: v.id,
            name: v.name,
            address: v.address >>> 0
        }
    })
}

const createFromRequest = (db: Database, req: InterfaceCreationRequest) => {
    db.prepare(
        `INSERT INTO interfaces (name, address, endpoint, privatekey, pubkey, mtu, netmask, netaddress, broadcast, listenport) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    ).run(
        req.name,
        Number(req.address),
        req.endpoint,
        req.privateKey,
        req.pubkey,
        req.mtu,
        req.netmask,
        Number(req.netaddress),
        Number(req.broadcast),
        req.port
    );

    return db.lastInsertRowId
}

const createCreationRequest = async (data: FormData): Promise<InterfaceCreationRequest> => {
    if (!data.has("name")) throw new HTTPException(401, { message: "missing name" })
    const name = data.get("name")! as string;
    if (!data.has("address")) throw new HTTPException(401, { message: "missing address" })
    const address = data.get("address")! as string;

    if (!data.has("endpoint")) throw new HTTPException(401, { message: "missing endpoint" })
    const endpoint = data.get("endpoint")! as string;

    if (!data.has("port")) throw new HTTPException(401, { message: "missing port" })
    const port = parseInt(data.get("port")! as string);

    if (!data.has("netmask")) throw new HTTPException(401, { message: "missing netmask" })
    const netmask = parseInt(data.get("netmask")! as string);

    const addressIp = new IPv4(address);
    const ip = IPv4CidrRange.fromCidr(address + "/" + netmask);
    //    const octs = ipStart.getOctets();
    //    octs[3] = new Octet(0);
    //    ipStart.


    const mtu = 1420;
    const privateKey = await generatePrivkey();
    const pubkey = await generatePubkey(privateKey);

    return {
        name,
        address: Number(addressIp.getValue()),
        endpoint,
        mtu,
        privateKey,
        pubkey,
        netmask,
        netaddress: Number(ip.getFirst().getValue()),
        broadcast: Number(ip.getLast().getValue()),
        port
    }
}

const deleteInterface = (db: Database, id: number) => {
    db.prepare("DELETE FROM interfaces WHERE id = ?")
        .run(id);
}

const INTERFACE_AND_USER_KEYS_QUERY = `
    SELECT
        i.id,
        i.name,
        i.address,
        i.netaddress,
        i.listenport,
        i.privatekey,
        i.pubkey,
        i.netmask,
        i.broadcast,
        i.mtu,
        json_group_array(
            json_object(
                'id', u.id,
                'name', u.name,
                'address', u.allowed_ip,
                'pubkey', u.publicKey,
                'privkey', u.privateKey,
                'psk', u.psk
            )
        ) FILTER (WHERE u.id IS NOT NULL) AS users

        FROM interfaces i
        LEFT JOIN users u ON u.interface_id = i.id
        WHERE i.id = ?
        GROUP BY i.id;`;
const INTERFACE_AND_USER_NON_KEYS_QUERY = `
                SELECT
                    i.id,
                    i.name,
                    i.address,
                    i.netaddress,
                    i.listenport,
                    i.netmask,
                    i.broadcast,
                    i.mtu,
                    json_group_array(
                        json_object(
                            'id', u.id,
                            'name', u.name,
                            'address', u.allowed_ip
                        )
                    ) FILTER (WHERE u.id IS NOT NULL) AS users

                FROM interfaces i
                LEFT JOIN users u ON u.interface_id = i.id
                WHERE i.id = ?
                GROUP BY i.id;
            `

export const getInterfaceAndUserByInterfaceId = (db: Database, id: number, fetchKeys = false) => {

    if (fetchKeys) {
        const r = db
            .prepare(fetchKeys ? INTERFACE_AND_USER_KEYS_QUERY : INTERFACE_AND_USER_NON_KEYS_QUERY)
            .get(id)!;

        return {
            id: r.id,
            name: r.name,
            netmask: r.netmask,
            address: r.address >>> 0,
            privatekey: r.privatekey,
            pubkey: r.pubkey,
            netaddress: r.netaddress >>> 0,
            broadcast: r.broadcast >>> 0,
            port: r.listenport,
            mtu: r.mtu,
            users: r.users.map((v, i) => {
                return {
                    id: v.id,
                    name: v.name,
                    address: v.address >>> 0,
                    pubkey: v.pubkey,
                    privkey: v.privkey,
                    psk: v.psk
                }
            })
        };

    } else {

        const r = db
            .prepare(fetchKeys ? INTERFACE_AND_USER_KEYS_QUERY : INTERFACE_AND_USER_NON_KEYS_QUERY)
            .get(id)!;

        if (!r) throw new Error("invalid id")

        return {
            id: r.id,
            name: r.name,
            netmask: r.netmask,
            address: r.address >>> 0,
            netaddress: r.netaddress >>> 0,
            broadcast: r.broadcast >>> 0,
            mtu: r.mtu,
            port: r.listenport,
            users: r.users.map((v, i) => {
                return {
                    id: v.id,
                    name: v.name,
                    address: v.address >>> 0
                }
            })
        };
    }
}

const updateAddress = (db: Database, ifId: number, address: number) => {
    const r = db
        .prepare(`UPDATE interfaces SET address = ? WHERE id = ?`)
        .run(address, ifId)
}

export const InterfaceApi = () => {
    const app = new Hono();

    app.get("/", async (c) => {
        //const rows = getMinimalinterfaceList(db);
        const data = await sendMessage({
            type: "interfaces"
        });
        return c.json(data);
    });

    app.post("/", async (c) => {
        const data = await c.req.formData();
        const request = await createCreationRequest(data);
        console.log(request);

        const res = await sendMessage({
            "type": "add_interface",
            "address": (new IPv4(request.address)).toString(),
            "endpoint": request.endpoint,
            "if_name": request.name,
            "mtu": request.mtu,
            "port": request.port,
            "subnet": request.netmask
        })

        //        const id = createFromRequest(db, request);

        const redirect = data.has("redirect") ? ((data.get("redirect") as string) + res.id) : ("api/" + id)

        c.status(201);

        return c.redirect(redirect as string)
    })

    app.get("/:id", async (c) => {
        const id = parseInt(c.req.param("id"));
        const query = await sendMessage({
            "type": "query_interface",
            id: id
        });
        console.log(query);
        return c.json(query.data);
        /*try {
            const rows = getInterfaceAndUserByInterfaceId(db, id);
            return c.json(rows);
        } catch (e) {
            console.error(e)
            throw new HTTPException(400, { message: "requested id doesnt exist" })
        }*/

    })

    app.delete("/:id", async (c) => {
        const id = parseInt(c.req.param("id"));
        const query = await sendMessage({
            "type": "remove_interface",
            id: id
        });

        //deleteInterface(db, id);

        c.status(200);
        return c.json(query)
    })

    app.post("/:id/delete", async (c) => {
        const id = parseInt(c.req.param("id"));
        //deleteInterface(db, id);
        const query = await sendMessage({
            "type": "remove_interface",
            id: id
        });

        const data = await c.req.formData();

        const redirect = data.has("redirect") ? (data.get("redirect") as string) : "api/"


        return c.redirect(redirect)
    })

    app.put("/:id", async (c) => {
        const id = parseInt(c.req.param("id"));

        const formData = await c.req.formData();
        const name = formData.get("name") as string;
        const value = formData.get("value");

        switch (name) {
            case "address":
                {
                    const i = new IPv4(value as string);
                    updateAddress(db, id, Number(i.getValue()))
                }
                break;

            default:
                throw new HTTPException(400, { message: "invalid selection" })
        }
    })

    //app.route("/:id/users", UsersApi(db))

    return app;
}