import { Database } from "@db/sqlite";

const db = new Database("test.db");

export function initDatabase() {
    db.exec("PRAGMA foreign_keys = ON;");
    const create_stmt = Deno.readTextFileSync("database.sql")
    db.exec(create_stmt);
}

export default db;