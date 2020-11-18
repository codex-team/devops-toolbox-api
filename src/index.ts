import ws from 'ws';
import express from 'express';
import app from './app';
import Config from './config';
import Request from './types/request';
import WorkspacesController from './controllers/workspaces';
import ClientsList from './utils/clientsList';
import Client from './types/client';
import WorkspacesService from './services/workspace';

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

  /**
   * Currently connected clients
   */
  const clients = ClientsList.getClients();

  /**
   * Connected client's authorization token
   */
  const authToken = req.headers.authorization!;

  /**
   * Connected client's workspaces list
   */
  const workspaces = await WorkspacesService.find({ authToken });

  if (workspaces?.length) {
    const client: Client = {
      socket,
      workspaceIds: workspaces.map(workspace => workspace._id),
    };

    clients.add(client);
  } else {
    socket.send('Error authorization');

    /**
     * 1007 - Wrong request (https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)
     */
    socket.close(1007, 'Wrong authorization token');
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
   * Сlient disconnecting handler
   */
  socket.on('close', () => {
    clients.remove(socket);
  });

  /**
   * Sockets error handler 
   */
  socket.on('error', () => {
    clients.remove(socket);
  });
});
