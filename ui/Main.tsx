import { CSSProperties, FC } from "hono/jsx";

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

export const MainView: FC = () => {
    return (
        <>
            <h1>MainView</h1>
            <form action="/api" method="post">
                <label for="name" style={BlockElementsCSS}>Interfacename:</label>
                <input type="text" name="name" style={BlockElementsCSS}></input>
                <label for="address" style={BlockElementsCSS}>Address:</label>
                <input type="text" name="address" style={BlockElementsCSS}></input>
                <label for="netmask" style={BlockElementsCSS}>Networksize:</label>
                <NetmaskPicker />
                <label for="endpoint" style={BlockElementsCSS}>Public Endpoint Address:</label>
                <input type="text" name="endpoint" style={BlockElementsCSS}></input>
                <button type="submit" style={BlockElementsCSS}>Add</button>
            </form>
        </>
    )
}