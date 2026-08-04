import { request } from "node:http";
import { Root } from "./api.tsx";

if (import.meta.main) {

  const app = Root(Deno.args[0]);
  //Deno.serve({port: 8080 }, )
  Deno.serve({ port: 8080 }, app.fetch)
}
