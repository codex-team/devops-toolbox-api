# DevOps Toolbox API

## Development guide 

To run application in Docker:

1. Fill `.env` file with necessary values (see .env.sample)
2. Run the `docker-compose`:
    Development mode with hot-reloading:
    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```
    Production mode:
    ```bash
    docker-compose -f docker-compose.prod.yml up
    ```

## API 

### REST API routes

The REST API used for communication between agents and the backend.

__Authorization__

All the REST request requires the authorization via the `Authorization` header:

```bash
Authorization: Bearer <Integration Token>
```

#### `PUT /services`

Route for updating the information about the services running of observed server.

##### Fields 

| Field | Type | Required | Description |
| -- | -- | -- | -- |
| `services` | _Service[]_ | yes | List of all found [services](docs/services.md) |

##### Example

```json
{
    "services": [
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
    ]
}
```

##### Response

| Field | Type | Description |
| -- | -- | -- |
| `success` | _boolean_ | `true` on successful saving, otherwise `false` |
| `workspace` | _Workspace_ | Updated workspace info |

### CTProto API

The communication between the backend and clients is going through the [CodeX Transport Protocol](src/utils/ctproto).

All supported messages will be listed below.

#### `authorize`

Message for authorization required by protocol.

##### Payload 

| Field | Type | Required | Description |
| -- | -- | -- | -- |
| `token` | _string_ | yes | Client Authorization token |

##### Example

```json
{
  "type": "authorize",
  "messageId": "deo2BInCZC",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

##### Response 

| Field | Type | Description |
| -- | -- | -- |
| `workspaceIds` | _string[]_ | Owned workspaces ids |
 
