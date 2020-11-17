# Routes

### `/services` - для взимодействия API и Agent

* **PUT** - обновляет сервисы сервера в БД
    
    Обязательные данные :
    
    * Headers: _Authorization_ - токен сервера
    * `services` - массив всех сервисов на сервере
    
    Пример запроса:
    
    Authorization = k2bk2gbjfe4ifhweofhow5ed
    
    ```
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
                },
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
                },
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
                },
                {
                    "type": "interfaces",
                    "payload": [
                        {
                            "name": "ens3",
                            "ip_address": "92.53.77.245",
                            "netmask": "24"
                        }
                    ]
                },
                {
                    "type": "disk",
                    "payload": {
                        "All": 29.47,
                        "Used": 23.97,
                        "Free": 5.5,
                        "Percent": 81
                    }
                }
            ]
        }
    ```
