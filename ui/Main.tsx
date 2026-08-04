import { CSSProperties, FC } from "hono/jsx";
import { MinimalInterfaceConfig } from "../api/Interfaces.ts";
import { IPv4 } from "ip-num";
import type { PublicInterfaceConfig } from "../wgmd/main.ts";

const BlockElementsCSS: CSSProperties = {
    display: "block",
    margin: ".5em 0 0 0"
}

export const NetmaskPicker = () => {
    return (
        <select name="netmask" style={BlockElementsCSS}>
            {(Array.from({ length: 32 })).map((_v, i) => {
                return <option key={i} value={i + 1}>/{i + 1}</option>
            })}
        </select>
    )
}

export const MainView: FC<{ interfaces: PublicInterfaceConfig[] }> = ({ interfaces }) => {
    return (
        <>
            <h1>MainView</h1>
            <ul>
                {interfaces.map((v, i) => {
                    return (
                        <li key={i}>
                            <a href={"/if/" + v.id}>
                                {v.name}
                            </a>
                        </li>
                    )
                })}
            </ul>

            <h2>Add Interface</h2>
            <form action="/api/interface" method="post">
                <label for="name" style={BlockElementsCSS}>Interfacename:</label>
                <input type="text" name="name" style={BlockElementsCSS}></input>
                <label for="address" style={BlockElementsCSS}>Address:</label>
                <input type="text" name="address" style={BlockElementsCSS}></input>
                <label for="netmask" style={BlockElementsCSS}>Networksize:</label>
                <NetmaskPicker />
                <label for="endpoint" style={BlockElementsCSS}>Public Endpoint Address:</label>
                <input type="text" name="endpoint" style={BlockElementsCSS}></input>
                <label for="port" style={BlockElementsCSS}>Public Listen Port:</label>
                <input type="number" name="port"></input>
                <input type="hidden" name="redirect" value="/if/" />
                <button type="submit" style={BlockElementsCSS}>Add</button>
            </form>

            <h2>Actions</h2>
            <form action="/api/config/export">
                <button type="submit">Export</button>
            </form>
        </>
    )
}

interface InterfaceProps {
    def: PublicInterfaceConfig
}

export const InterfaceView: FC<InterfaceProps> = ({ def }) => {
    return (
        <>
            <h1>Interface: {def.name}</h1>
            <a href="/">Back</a>
            <p>Address: {def.netaddress}/{def.netmask}</p>
            <p>Network Address: {def.netaddress}</p>
            <p>Users</p>
            <ul>
                {def.users.map((v, i) => {
                    return <li key={i + "-" + v.id}>
                        <span>
                            {v.name}: {new IPv4(v.address).toString()}
                            </span><a href={`/api/interface/${def.id}/users/${v.id}/client`}>Client</a>
                    </li>
                })}
            </ul>

            <h2>Add User</h2>
            <form action={`/api/interface/${def.id}/users`} method="post">
                <label for="name">Username:</label>
                <input type="text" name="name"></input>
                <label for="ip">Client IP:</label>
                <input type="text" name="ip"></input>
                <input type="hidden" name="redirect" value="/if/" />
                <input type="submit"></input>
            </form>

            <h2>Actions</h2>
            <form action={`/api/interface/${def.id}/delete`} method="post">
                <input type="hidden" name="redirect" value="/"></input>
                <button type="submit">Delete</button>
            </form>
        </>
    )
}