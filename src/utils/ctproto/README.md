# CodeX Transport Protocol

CodeX Transport Protocol (CTProto) - is the presentation-layer of the [OSI](https://en.wikipedia.org/wiki/OSI_model) model for communication between services.

This is a JavaScript implementation example.

## Connection

CTProto uses WebSockets as transport-layer.

After connection to the endpoit specified by application, you need to send the __authorization__ message in 3 seconds. Otherwise, the connection will be closed.

## Communication

### Message format

All messages MUST fit next criteries:

- be a valid JSON-strings
- has the next structure:

| field | type | purpose |
| -- | -- | -- |
| `messageId` | _string_ | Unique message identifier. Create using the [nanoid(10)](https://github.com/ai/nanoid) method |
| `type` | _string_ | Message action type. Related to business logic |
| `payload` | _object_ | Any mesage data |

Example of a correct message:

```
"{\"messageId\":\"qUw0SWTeJX\",\"type\":\"update-workspace\",\"payload\":{\"name\":\"Example\"}}"
```

## Authorisation

## Errors handling

