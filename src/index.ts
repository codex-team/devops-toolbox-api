import app from './app';
import Config from './config/config';
import ws from 'ws';


app.listen(Config.http_port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.http_port}`);
});

const server = new ws.Server({ port: Config.ws_port }, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:${Config.ws_port}`);
});

server.on('connection', (socket) => {
  socket.send('It works!');

  socket.on('message', (data) => {
    console.log(data);
    socket.send('Hi!');
  });
});
