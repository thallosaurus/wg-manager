import { Hono } from "hono";
import { AddInterfaceRequest, AddUserRequest, SocketConnection } from "./wgmd/main.ts";
import { InterfaceView, MainView } from "./ui/Main.tsx";
import { HTTPException } from "hono/http-exception";
import { IPv4 } from "ip-num";

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

const createUserCreationRequest = (interfaceId: number, data: FormData): AddUserRequest => {
    if (!data.has("name")) throw new HTTPException(401, { message: "missing name" })
    const name = data.get("name")!.toString();

    if (!data.has("ip")) throw new HTTPException(401, { message: "missing client ip" })
    const ip = new IPv4(data.get("ip")! as string);

    return {
        address: ip.toString(),
        username: name,
        interface_id: interfaceId as unknown as bigint
    }
}

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
    router.post("/", async (c) => {
        const socket = c.get("socket");
        const interfaceId = parseInt(c.req.param("id")!);
        const data = await c.req.formData();
        const req = await createUserCreationRequest(interfaceId, data)
        const res = await socket.addUser(req);

        console.log(res);
        if (res.type !== "add_user") return c.html(<h1>Error</h1>)

        const redirect = data.has("redirect") ? ((data.get("redirect") as string) + interfaceId) : ("api/interface/" + interfaceId)

        return c.redirect(redirect)
    })

    /*router.get("/:user/client", (c) => {
        const interfaceId = parseInt(c.req.param("id")!);
        const userId = parseInt(c.req.param("user")!);
        console.log(userId, interfaceId)
        const data = getUserFromInterface(db, interfaceId, userId, true)
        return c.text(writeOutWireguardClientConfig(data))
    })*/

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

const createInterfaceCreationRequest = (data: FormData): AddInterfaceRequest => {
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
    const mtu = 1420;

    return {
        if_name: name,
        address: addressIp.toString(),
        endpoint,
        mtu,
        port,
        subnet: netmask
    }
}

export const InterfaceApi = () => {
    const app = new Hono<Env>();

    app.get("/", async (c) => {
        const socket = c.get("socket");
        const data = await socket.queryAllInterfaces();
        return c.json(data);
    });

    app.post("/", async (c) => {
        const socket = c.get("socket");
        const data = await c.req.formData();
        const request = await createInterfaceCreationRequest(data);

        const r = await socket.addInterface(request);
        if (r.type !== "add_interface") return c.html(<h1>Error</h1>)
        const redirect = data.has("redirect") ? ((data.get("redirect") as string) + r.data) : ("api/" + r.data)
        c.status(201);
        return c.redirect(redirect as string)
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
        return c.json(query.status)
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