import { FC } from "hono/jsx";

export const MainView: FC = () => {
    return (
        <>
            <h1>MainView</h1>
            <form action="/api" method="post">
                <label for="name">Interfacename:</label>
                <input type="text" name="name"></input>
                <label for="address">Address:</label>
                <input type="text" name="address"></input>
                <label for="networksize">Networksize:</label>
                <input type="text" name="networksize"></input>
                <button type="submit">Add</button>
            </form>
        </>
    )
}