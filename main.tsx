import { Hono } from 'hono';
import { MainView } from "./ui/Main.tsx";
import db, { initDatabase } from "./database.ts";
import { InterfaceApi } from "./api/Interfaces.ts";

if (import.meta.main) {
  initDatabase();
  
  const app = new Hono();
  app.get("/", (c) => {
    return c.html(<MainView />)
  })
  app.route("/api", InterfaceApi(db));
  Deno.serve({ port: 8080 }, app.fetch)
}
