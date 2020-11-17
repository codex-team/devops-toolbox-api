# Services

### `nginx`

* server_name: string
* listen: number[]
* proxy_pass: string []

Example:
```
{
    "type": "nginx",
    "payload": [
        {
            "server_name": "api.notes.codex.so",
            "listen": [
                "443"
            ],
            "proxy_pass": [
                "http://127.0.0.1:5500/"
            ]
        }
    ]
}
```

### `docker`

* names: string
* container_id: string
* image: string
* created: string
* status: string
* ports: object[]
    * inner: object
        * host: string
        * port: number
        * type: string
    * outer: object
        * host: string
        * port: number
        * type: string
        
Example:

```
{
    "type": "docker",
    "payload": [
        {
            "names": "codexnotesserver_nginx_1",
            "container_id": "cfcc3015502b",
            "image": "codexnotesserver_nginx",
            "created": "2019-10-30 08:30:15",
            "status": "Up 3 weeks",
            "ports": [
                {
                    "inner": {
                        "host": "",
                        "port": 80,
                        "type": "tcp"
                    },
                    "outer": {
                        "host": "127.0.0.1",
                        "port": 5500,
                        "type": ""
                    }
                }
            ]
        }
    ]
}
```
    
### `ports`

* proto: string
* local_address: object
    * host: string
    * port: number
* state: string

Example:

```
{
    "type": "ports",
    "payload": [
        {
            "proto": "tcp",
            "local_address": {
                "host": "0.0.0.0",
                "port": 80
            },
            "state": "LISTEN"
        }
    ]
}
```
### `interfaces`

* name: string
* ip_address: string
* netmask: string

Example

```
{
    "type": "interfaces",
    "payload": [
        {
            "name": "ens3",
            "ip_address": "92.53.77.245",
            "netmask": "24"
        }
    ]
}
```
### `disk`

* All: number
* Used: number
* Free: number
* Percent: number

Example

```
{
    "type": "disk",
    "payload": {
        "All": 29.47,
        "Used": 23.97,
        "Free": 5.5,
        "Percent": 81
    }
}
```
 
