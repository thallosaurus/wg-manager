import { Hono } from "hono";
import { AddInterfaceRequest, AddUserRequest, SocketConnection } from "./wgmd/main.ts";
import { InterfaceView, MainView } from "./ui/Main.tsx";
import { HTTPException } from "hono/http-exception";
import { IPv4 } from "ip-num";

import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';

const SOCKET_PATH = "/var/run/wgmd.sock";

type Env = {
    Variables: {
        socket: SocketConnection
    }
}

export const ConfigRoutes = () => {
    const route = new Hono<Env>();

    route.get("/export", async (c) => {
        const socket = c.get("socket");
        await socket.export();

        return c.text("ok")
    })

    return route;
}

const AddUserSchema = z.object({
    name: z.string(),
    ip: z.string()
})

export const UsersApi = () => {
    const router = new Hono<Env>();
    router.get("/:user", async (c) => {
        const interface_id = parseInt(c.req.param("id")!);
        const user_id = parseInt(c.req.param("user")!);
        const socket = c.get("socket");
        const data = await socket.queryUser({ id: user_id, if_id: interface_id });

        if (data.type !== "query_user") return c.html(<h1>Error</h1>)
        return c.json(data.data)
    })

    router.post("/", zValidator("json", AddUserSchema), async (c) => {
        const socket = c.get("socket");
        const data = c.req.valid("json");

        const interface_id = parseInt(c.req.param("id")!);
        //const data = await c.req.formData();
        //const req = await createUserCreationRequest(interfaceId, data)
        const res = await socket.addUser({
            interface_id: BigInt(interface_id),
            address: new IPv4(data.ip).toString(),
            username: data.name
        });

        console.log(res);
        if (res.type !== "add_user") return c.html(<h1>Error</h1>)

            //c.req.query("redirect")

        //const redirect = data.has("redirect") ? ((data.get("redirect") as string) + interfaceId) : ("api/interface/" + interfaceId)

        //return c.redirect(redirect)
    })

    router.get("/:user/client", async (c) => {
        const socket = c.get("socket");
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);
        //const data = getUserFromInterface(db, interfaceId, userId, true)
        //return c.text(writeOutWireguardClientConfig(data))
        const data = await socket.exportClient({
            interface_id: interfaceId as unknown as bigint,
            user_id: userId as unknown as bigint,
        })

        if (data.type !== "client_cert") return c.html(<h1>Error</h1>)

        return new Response(data.data, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Content-Disposition": 'attachment; filename="client.conf"',
            },
        });
    })

    router.delete("/:user", async (c) => {
        const socket = c.get("socket");

        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);

        const res = await socket.removeUser({
            "interface_id": interfaceId as unknown as bigint,
            "user_id": userId as unknown as bigint
        })

        if (res.type !== "status") return c.html(<h1>Error</h1>)

        return c.json(res)
    })

    return router;
}

const CreateInterfaceSchema = z.object({
    name: z.string(),
    address: z.string(),
    endpoint: z.string(),
    port: z.number(),
    netmask: z.number(),
    dnsdomain: z.string(),
    mtu: z.number().default(1420)
});

export const InterfaceApi = () => {
    const app = new Hono<Env>();

    app.get("/", async (c) => {
        const socket = c.get("socket");
        const data = await socket.queryAllInterfaces();
        return c.json(data);
    });

    app.post("/",
        zValidator('json', CreateInterfaceSchema),
        async (c) => {
            const socket = c.get("socket");
            //const data = await c.req.formData();
            //const request = await createInterfaceCreationRequest(data);
            const data = c.req.valid("json");

            const r = await socket.addInterface({
                "if_name": data.name,
                "address": data.address,
                "dnsdomain": data.dnsdomain,
                "endpoint": data.endpoint,
                "mtu": data.mtu,
                "port": data.port,
                "subnet": data.netmask
            });

            if (r.type !== "add_interface") return c.html(<h1>Error</h1>)
            //const redirect = data.has("redirect") ? ((data.get("redirect") as string) + r.data) : ("api/" + r.data)
            return c.status(201);
            //return c.redirect(redirect as string)
        })

    app.get("/:id", async (c) => {
        const socket = c.get("socket");
        const id = parseInt(c.req.param("id"));
        const query = await socket.queryInterface({ id });

        if (query.type !== "query_interface") return c.html(<h1>Error</h1>)
        return c.json(query.data);
    })

    app.delete("/:id", async (c) => {
        const socket = c.get("socket");

        const id = parseInt(c.req.param("id"));
        const query = await socket.removeInterface({ "id": id as unknown as bigint });
        if (query.type !== "status") return c.html(<h1>Error</h1>)

        c.status(200);
        return c.redirect("/")
    })

    app.post("/:id/delete", async (c) => {
        const socket = c.get("socket");

        const id = parseInt(c.req.param("id"));
        const query = await socket.removeInterface({ "id": id as unknown as bigint });
        if (query.type !== "status") return c.html(<h1>Error</h1>)

        c.status(200);

        const data = await c.req.formData();
        const redirect = data.has("redirect") ? (data.get("redirect") as string) : "api/"

        return c.redirect(redirect)
    })

    app.route("/:id/users", UsersApi());

    return app;
}

const Api = () => {
    const router = new Hono<Env>();
    router.route("/interface", InterfaceApi());
    router.route("/config", ConfigRoutes());
    return router;
}

const InbuiltUi = () => {
    const router = new Hono<Env>();
    router.get("/", async (c) => {
        const socket = c.get("socket");
        const res = await socket.queryAllInterfaces();
        console.log(res);
        if (res.type !== "interfaces") return c.html(<h1>Error</h1>);
        return c.html(<MainView interfaces={res.data} />)
    })
    router.get("/if/:id", async (c) => {
        const socket = c.get("socket");
        const id = parseInt(c.req.param("id"));
        const res = await socket.queryInterface({ id });

        if (res.type !== "query_interface") return c.html(<h1>Error</h1>)

        return c.html(<InterfaceView def={res.data} />)
    })
    return router;
}

export function Root(socket_path?: string) {
    const root = new Hono<Env>();
    root.use(async (c, next) => {
        c.set("socket", await SocketConnection.connect(socket_path ?? SOCKET_PATH));
        await next();
    })
    root.route("/", InbuiltUi());
    root.route("/api", Api());
    return root;
}