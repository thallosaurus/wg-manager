import { FC } from "hono/jsx";
import { DatabaseSync } from "node:sqlite";
import { Layout } from "./Layout.tsx";
import { Hono } from "hono";



export const InterfaceList: FC<InterfaceListProps> = ({ content }) => {
    return (
        <ul>{
            content.map((v) => {
                return <li key={v.id}>{v.name}</li>
            })
        }</ul>
    )
}


export const InterfaceListRoutes = (db: DatabaseSync) => {
    const app = new Hono();

    // Main Page
    app.get("/", (c) => {
        const rows = db
            .prepare("SELECT id, name FROM interfaces")
            .all()
            .map(mapInterfaces);

        return c.html(<Layout>
            <InterfaceList content={rows}/>
        </Layout>)
    });

    app.post("/", (c) => {
        db.prepare(
            `INSERT INTO interfaces (name) VALUES (?);`,
        ).run("Bob");
        return c.redirect("/")
    })

    return app;
}