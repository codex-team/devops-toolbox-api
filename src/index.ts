import ws from 'ws';
import express from 'express';
import app from './app';
import Config from './config';
import Request from './types/request';
import WorkspacesController from './controllers/workspaces';
import Clients from './utils/clients';
import Client from './types/client';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const server = new ws.Server({
  port: Config.wsPort,
  path: '/client',
}, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:${Config.wsPort}/client`);
});

const clients: Clients = new Clients();

server.on('connection', (socket: ws, req: express.Request) => {
  socket.send('Сonnected!');

  const client: Client = {
    socket,
    authToken: req.headers.authorization!,
  };

  clients.add(client);

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

export { clients };
