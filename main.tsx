import { Hono } from 'hono';
import { InterfaceView, MainView } from "./ui/Main.tsx";
import { initDatabase } from "./database.ts";
import { getInterfaceAndUserByInterfaceId, getMinimalinterfaceList, InterfaceApi } from "./api/Interfaces.ts";
import { IPv4 } from "ip-num";
import { ConfigRoutes } from "./api/Config.ts";
import { Database } from "@db/sqlite";

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

  app.get("/if/:id", (c) => {
    const id = parseInt(c.req.param("id"))
    try {

      const data = getInterfaceAndUserByInterfaceId(db, id)!;
      console.log(data)
      //const ip = IPv4.fromNumber(BigInt(data.address));
      return c.html(<InterfaceView
        interfaceId={data.id}
        name={data.name}
        address={new IPv4(data.address)}
        netaddress={new IPv4(data.netaddress)}
        broadcast={new IPv4(data.broadcast)}
        users={data.users}
        netmask={data.netmask} />)
      } catch (e) {
        return c.html(<>
          <h1>Invalid Selection</h1>
        </>)
      }
  })

  app.route("/api", ApiRoute(db));
  Deno.serve({ port: 8080 }, app.fetch)
}
