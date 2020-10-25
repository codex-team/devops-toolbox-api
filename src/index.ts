import app from './app';
import Config from './config/config';
import ws from 'ws';

const port = Config.port;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const server = new ws.Server({ port: port }, () => {
  console.log(`⚡️[server]: Server is running at ws://localhost:8080`);
});

server.on('connection', (socket) => {
  socket.send('It works!');

  socket.on('message', (data) => {
    console.log(data);
    socket.send('Hi!');
  })
});


