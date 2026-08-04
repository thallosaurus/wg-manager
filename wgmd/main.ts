import type { AddInterfaceRequest, AddUserRequest, RemoveInterfaceRequest, RemoveUserRequest, WgmdAnswer, WgmdMessages } from "./bindings/messages.ts"
export * from "./bindings/messages.ts"

export class SocketConnection {
    #conn: Deno.UnixConn

    static async connect(path = "/var/run/wgmd.sock"): Promise<SocketConnection> {
        const conn = await Deno.connect({ transport: "unix", path: "/var/run/wgmd.sock" })
        return new this(conn)
    }

    constructor(conn: Deno.UnixConn) {
        this.#conn = conn;
    }

    async addInterface(req: AddInterfaceRequest) {
        await this.#sendMessage({ type: "add_interface", ...req });
    }

    async removeInterface(req: RemoveInterfaceRequest) {
        await this.#sendMessage({ type: "remove_interface", ...req });
    }
    async queryInterface({ id }:{ id: number }) {
        await this.#sendMessage({ type: "query_interface", id: id as unknown as bigint })
    }
    
    async addUser(req: AddUserRequest) {
        await this.#sendMessage({ type: "add_user", ...req });
    }

    async removeUser(req: RemoveUserRequest) {
        await this.#sendMessage({ type: "remove_user", ...req });
    }

    async queryUser({id, if_id }: { id: number, if_id: number}) {
        await this.#sendMessage({ type: "query_user", user_id: id as unknown as bigint, interface_id: if_id as unknown as bigint })
    }

    async export() {
        await this.#sendMessage({ type: "export" })
    }

    async #sendMessage(m: WgmdMessages): Promise<WgmdAnswer> {
        const encoder = new TextEncoder();
        this.#conn.write(encoder.encode(JSON.stringify(m) + "\n"));

        const buf = new Uint8Array(1000);
        const b = await this.#conn.read(buf);
        const decoder = new TextDecoder();
        const s = decoder.decode(buf.subarray(0, b!));
        return JSON.parse(s);
    }
}