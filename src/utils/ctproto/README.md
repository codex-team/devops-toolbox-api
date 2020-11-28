# CodeX Transport Protocol

CodeX Transport Protocol (CTProto) - is the presentation-layer of the [OSI](https://en.wikipedia.org/wiki/OSI_model) model for communication between services.

This is a JavaScript implementation example.

## Connection

CTProto uses WebSockets as transport-layer.

After connection to the endpoint specified by application, you need to send the __authorization__ message in 3 seconds. Otherwise, the connection will be closed.

## Communication

### Message format

All messages MUST fit next criteries:

- be a valid JSON-strings
- has the next structure:

| field | type | purpose |
| -- | -- | -- |
| `messageId` | _string_ | Unique message identifier. Create using the [nanoid(10)](https://github.com/ai/nanoid) method |
| `type` | _string_ | Message action type. Related to business logic |
| `payload` | _object_ | Any message data |

Example of a correct message:

```
"{\"messageId\":\"qUw0SWTeJX\",\"type\":\"update-workspace\",\"payload\":{\"name\":\"Example\"}}"
```

## Authorisation

The first message after establishing the connection should be the `authorize`. 
If the server won't accept this message after 3 seconds after connection, it will close the connection.

Example of auth request:

```json
{
  "type": "authorize",
  "messageId": "deo2BInCZC",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

The `payload` can contain any data that is used for authorization in your application. If auth will be successful, you will get a message with authorization data as a response. For example:

Example of auth response message:

```json
{
  "messageId": "deo2BInCZC",
  "payload": {
    "userId": "12345",
    "workspaceIds": ["111", "222", "333"]
  }
}
```



 

## Server

