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
                            "smth": "smth"
                        }
                    ]
                },
                {
                    "type": "docker",
                    "payload": [
                        {
                            "smth": "smth"
                        }
                    ]
                },
                {
                    "type": "ports",
                    "payload": [
                        {
                            "smth": "smth"
                        }
                    ]
                },
                {
                    "type": "interfaces",
                    "payload": [
                        {
                            "smth": "smth"
                        }
                    ]
                },
                {
                    "type": "disk",
                    "payload": {
                        "smth": "smth"
                    }
                }
            ]
        }
    ```
       
       
* **POST** - Добавляет воркспейс в БД
    
    Обязательные данные :
    
    * `name` - имя Воркспейса
    * `authToken` - токен авторизации
    * `servers` - серверы 
        * `name` - имя сервера
        * `token` - токе сервера
        * `services` - сервисы сервера  
        
    ```
        {
        	"name": "CodeX",
        	"authToken": "1",
        	"servers": [
        		{
        			"name": "Neptune",
        			"token": "k2bk2gbjfe4ifhweofhow5ed",
        			"services": [
                        {
                            "type": "nginx",
                            "payload": [
                                {
                                    "smth": "smth"
                                }
                            ]
                        },
                        {
                            "type": "docker",
                            "payload": [
                                {
                                    "smth": "smth"
                                }
                            ]
                        },
                        {
                            "type": "ports",
                            "payload": [
                                {
                                    "smth": "smth"
                                }
                            ]
                        },
                        {
                            "type": "interfaces",
                            "payload": [
                                {
                                    "smth": "smth"
                                }
                            ]
                        },
                        {
                            "type": "disk",
                            "payload": {
                                "smth": "smth"
                            }
                        }
                    ]
        		}
        	]
        }
    ```
