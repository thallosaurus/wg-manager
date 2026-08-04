import { Root } from "./api.tsx";

if (import.meta.main) {

  const app = Root();
  Deno.serve({ port: 8080 }, app.fetch)
}
