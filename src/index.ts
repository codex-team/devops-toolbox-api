import app from './app';
import Config from './config';
import ws from 'ws';
import { Request } from './types/request';
import WorkspacesController from './controllers/workspaces';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const server = new ws.Server({
  port: Config.wsPort,
  path: '/client',
}, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:${Config.wsPort}/client`);
});

server.on('connection', (socket) => {
  socket.send('Сonnected!');

  socket.on('message', async (data: string) => {
    const dataObj: Request = JSON.parse(data.toString());

    let result;

    switch (dataObj.type) {
      case 'getWorkspaces':
        result = await WorkspacesController.getWorkspaces();
        break;
    }

    socket.send(JSON.stringify({
      messageId: dataObj.messageId,
      response: result,
    }));
  });
});
