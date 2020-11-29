# Services

This document describes the structure of services supported by DevOps Toolbox monitoring.

### `nginx`

Represents information about websites handled by nginx webserver. 

#### Fields

| field | type | description | 
| `serverName` | _string_ | Code name of a server |
| `listen` | _number[]_ | List of listening ports |
| `proxyPass` | _string[]_ | Proxy info |

#### Example 

```
{
    "type": "nginx",
    "payload": [
        {
            "serverName": "api.notes.codex.so",
            "listen": [
                443
            ],
            "proxyPass": [
                "http://127.0.0.1:5500/"
            ]
        }
    ]
}
```
