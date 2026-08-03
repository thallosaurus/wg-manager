import { Hono } from 'hono';
import { InterfaceView, MainView } from "./ui/Main.tsx";
import { initDatabase } from "./database.ts";
import { getInterfaceAndUserByInterfaceId, getMinimalinterfaceList, InterfaceApi } from "./api/Interfaces.ts";
import { IPv4 } from "ip-num";
import { ConfigRoutes } from "./api/Config.ts";
import { Database } from "@db/sqlite";
import { sendMessage } from "./socket.ts";
import type { PublicInterfaceConfig } from "./wgmd/main.ts";

const ApiRoute = (db: Database) => {
  const router = new Hono();
  router.route("/interface", InterfaceApi(db));
  router.route("/config", ConfigRoutes(db));
  return router;
}

if (import.meta.main) {
  const db = initDatabase();

  const app = new Hono();
  app.get("/", (c) => {
    const interfaces = getMinimalinterfaceList(db);

    return c.html(<MainView interfaces={interfaces} />)
  });

  app.get("/if/:id", async (c) => {
    const id = parseInt(c.req.param("id"))

    const data = await sendMessage({
      "type": "query_interface",
      id: id as unknown as bigint
    })

    console.log(data);
    if (data.type !== "query_interface") {
      return c.html(<h1>Error</h1>)
    } else {

      const d = data as PublicInterfaceConfig;
      /*try {
  
        const data = getInterfaceAndUserByInterfaceId(db, id)!;
        console.log(data)
        //const ip = IPv4.fromNumber(BigInt(data.address));
        */
      return c.html(<InterfaceView
        interfaceId={data.id}
        name={data.name}
        address={new IPv4(data.address)}
        netaddress={new IPv4(data.netaddress)}
        broadcast={new IPv4(data.broadcast)}
        users={data.users}
        netmask={data.netmask} />)
    }
  })

  app.route("/api", ApiRoute(db));
  Deno.serve({ port: 8080 }, app.fetch)
}
