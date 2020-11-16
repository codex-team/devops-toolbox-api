import ws from 'ws';
import express from 'express';
import app from './app';
import Config from './config';
import Request from './types/request';
import WorkspacesController from './controllers/workspaces';
import ClientsList from './utils/clientsList';
import Client from './types/client';
import WorkspacesService from './services/workspace';
import Workspace from './types/workspace';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const server = new ws.Server({
  port: Config.wsPort,
  path: '/client',
}, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:${Config.wsPort}/client`);
});

/**
 *  Client connects
 */
server.on('connection', async (socket: ws, req: express.Request) => {
  socket.send('Сonnected!');

  const clients: ClientsList = ClientsList.getClients();

  const authToken: string = req.headers.authorization!;

  const workspaces: Workspace[] | null = await WorkspacesService.find({ authToken });

  if (workspaces?.length) {
    const client: Client = {
      socket,
      workspaces: workspaces.map(workspace => workspace._id),
    };

    clients.add(client);
  } else {
    socket.send('Error authorization');
    socket.close(1007);
  }

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

  /**
   * Сlient disconnects
   */
  socket.on('close', () => {
    clients.remove(socket);
  });

  /**
   * Error
   */
  socket.on('error', () => {
    clients.remove(socket);
  });
});
