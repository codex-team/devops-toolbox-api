import app from './app';
import Config from './config';
import ws from 'ws';
import Request from './types/request';
import mongoose from 'mongoose';
import WorkspacesController from './controllers/workspaces';

mongoose.connect(Config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log('⚡️[DB]: DB is running');
})
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

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

    socket.send(JSON.stringify(result));
  });
});
