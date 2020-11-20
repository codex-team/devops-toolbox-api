import app from './app';
import Config from './config';
import Transport from './utils/protocol/transport';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const transport: Transport = new Transport({
  port: Config.wsPort,
  path: Config.wsPath,
});
