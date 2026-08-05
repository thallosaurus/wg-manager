export default [{
    url: "/api/interface",
    method: "get",
    response: () => {
        return { "type": "interfaces", "data": [{ "id": 1, "name": "test0", "netaddress": "172.16.0.1", "listenport": 12345, "netmask": 24, "users": [{ "id": 5, "name": "redirect_test", "address": "172.16.0.6" }, { "id": 2, "name": "test", "address": "172.16.0.3" }, { "id": 3, "name": "test33", "address": "172.16.0.4" }, { "id": 4, "name": "test34", "address": "172.16.0.5" }, { "id": 1, "name": "testuser", "address": "172.16.0.2" }] }] }
    }
}, {
    url: "/api/interface/1",
    method: "get",
    response: () => {
        return { "id": 1, "name": "test0", "netaddress": "172.16.0.1", "listenport": 12345, "netmask": 24, "users": [{ "id": 1, "name": "testuser", "address": "172.16.0.2" }, { "id": 2, "name": "test", "address": "172.16.0.3" }, { "id": 3, "name": "test33", "address": "172.16.0.4" }, { "id": 4, "name": "test34", "address": "172.16.0.5" }, { "id": 5, "name": "redirect_test", "address": "172.16.0.6" }] }
    }
},
{
    url: "/api/interface/1/users/1",
    method: "get",
    response: () => {
        return { "id": 1, "name": "testuser", "address": "172.16.0.2" }
    }
}
]