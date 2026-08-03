import { Database } from "@db/sqlite";


export function initDatabase(name = "wg_manager.db") {
    //const db = new Database(name);
    //db.exec("PRAGMA foreign_keys = ON;");
    //const create_stmt = Deno.readTextFileSync("database.sql")
    //db.exec(create_stmt);
    //return db;
}

export function initDebugDatabase() {
    return initDatabase("::memory::")
}