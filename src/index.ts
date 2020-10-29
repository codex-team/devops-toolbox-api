import app from './app';
import Config from './config';
import ws from 'ws';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const server = new ws.Server({ port: Config.wsPort }, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:${Config.wsPort}`);
});

server.on('connection', (socket) => {
  socket.send('It works!');

  socket.on('message', (data) => {
    console.log(data);
    socket.send('Hi!');
  });
});
