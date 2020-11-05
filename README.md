# devops-toolbox-api

## Run in Docker

### Development mode
To run app in development mode (with hot-reload) follow these steps:
1. Fill .env file with necessary values (see .env.sample)
2. Run `docker-compose`:
   ```
   docker-compose -f docker-compose.dev.yml up
   ```

### Production mode
To run app in production mode follow these steps:
1. Fill .env file with necessary values (see .env.sample)
2. Run `docker-compose`:
   ```
   docker-compose -f docker-compose.prod.yml up
   ```
