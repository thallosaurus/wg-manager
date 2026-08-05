import type { AddInterfaceRequest, AddUserRequest, RemoveInterfaceRequest, RemoveUserRequest, WgmdAnswer, WgmdMessages, ExportClientRequest } from "./bindings/messages.ts"
export * from "./bindings/messages.ts"

export class SocketConnection {
    #conn: Outgoing

    static async connect(path: string): Promise<SocketConnection> {
        const conn = await Deno.connect({ transport: "unix", path })
        return new this(conn)
    }

    constructor(conn: Outgoing = {
        write: async (p) => {
            const decoder = new TextDecoder();
            const decoded = decoder.decode(p);
            console.log(decoded);
            return decoded.length
        },
        read: async (p) => {
            return 0
        },
        
    }) {
        this.#conn = conn;
    }

    async addInterface(req: AddInterfaceRequest) {
        return await this.#sendMessage({ type: "add_interface", ...req });
    }

    async removeInterface(req: RemoveInterfaceRequest) {
        return await this.#sendMessage({ type: "remove_interface", ...req });
    }

    async queryAllInterfaces() {
        return await this.#sendMessage({ type: "interfaces" })
    }

    async queryInterface({ id }:{ id: number }) {
        return await this.#sendMessage({ type: "query_interface", id: id as unknown as bigint })
    }
    
    async addUser(req: AddUserRequest) {
        return await this.#sendMessage({ type: "add_user", ...req });
    }

    async removeUser(req: RemoveUserRequest) {
        return await this.#sendMessage({ type: "remove_user", ...req });
    }

    async queryUser({id, if_id }: { id: number, if_id: number}) {
        return await this.#sendMessage({ type: "query_user", user_id: id as unknown as bigint, interface_id: if_id as unknown as bigint })
    }

    async export() {
        return await this.#sendMessage({ type: "export" })
    }

    async exportClient(req: ExportClientRequest) {
        return await this.#sendMessage({ type: "export_client", ...req })
    }

    async #sendMessage(m: WgmdMessages): Promise<WgmdAnswer> {
        const encoder = new TextEncoder();
        const req = JSON.stringify(m);
        console.log(">", m);
        this.#conn.write(encoder.encode(req + "\n"));

        const buf = new Uint8Array(1000);
        const b = await this.#conn.read(buf);
        const decoder = new TextDecoder();
        const s = decoder.decode(buf.subarray(0, b!));
        const res = JSON.parse(s);
        console.log("<", res);
        return res;
    }
}

interface Outgoing {
    write(p: Uint8Array): Promise<number>
    read(p: Uint8Array): Promise<number | null>
}