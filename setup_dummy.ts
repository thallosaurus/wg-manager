import { AddInterfaceRequest, AddUserRequest, SocketConnection } from "./wgmd/main.ts";

let conn = await SocketConnection.connect("./wgmd/wgmd.sock")
let r = await conn.addInterface({
  if_name: "utun10",
  address: "172.16.128.1",
  endpoint: "vpn.example.net",
  mtu: 1420,
  subnet: 24,
  port: 12346,
  dnsdomain: "testnet.network.internal"
})

if (r.type == "add_interface") {
    const id = r.data;
    await conn.addUser({
      interface_id: id,
      username: "test",
      address: "172.16.128.2"
    })
}