export default [{
    url: "/api/interface",
    method: "get",
    response: () => {return [{ "id": 2, "name": "wg0", "address": 2887712772 }, { "id": 3, "name": "test0", "address": 1162167557 }]}
}, {
    url: "/api/interface/2",
    method: "get",
    response: () => {
        return {
            "id": 2,
            "name": "wg0",
            "netmask": 24,
            "address": 2887712772,
            "netaddress": 2887712768,
            "broadcast": 2887713023,
            "mtu": 1420,
            "port": 42069,
            "users": [
                {
                    "id": 2,
                    "name": "test",
                    "address": 2887712773
                }
            ]
        };
    }
},
{
    url: "/api/interface/2/users/2",
    method: "get",
    response: () => {
        return {
            "ip": 2887712773,
            "clientPubkey": "Tbd5EboOcLVphpqsvndCBwRGUazl0TETxZV11LK7cUQ=",
            "endpoint": "vpn.example.net",
            "port": 42069
        }
    }
}
]