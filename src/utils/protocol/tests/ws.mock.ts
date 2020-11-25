import ws from 'ws';

/**
 * Socket .close() mock
 */
export const socketClose = jest.fn();

/**
 * Socket .send(message: string) mock
 */
export const socketSend = jest.fn();

/**
 * Creates fake 'ws' library and imitate socket message event with passed payload.
 *
 * @param message - any payload data as it can be got from socket
 */
export function createWsMockWithMessage(message: unknown): typeof ws {
  /**
   * This is a mock for
   * socket.on(event, callback);
   *
   * it is used for calling the callback passed to the
   * socket.on('message', callback);
   *
   * In tests it will trigger the 'onmessage' handler.
   */
  const socketOnMock = jest.fn((event: string, callback: Function) => {
    // console.log(`socket.on("${event}") called`);
    callback(message);
  });

  /**
   * Fake 'socket' class instance
   */
  const socketMock = {
    on: socketOnMock,
    close: socketClose,
    send: socketSend,
  };

  /**
   * This mock is used to trigger callback passed to the server.on("connection", callback)
   *
   * wsServer.on('connection', (socket: ws, request: http.IncomingMessage) => {
   *   socket.on('message',
   *     (message: ws.Data) => {                <--- we will save this callback and call it with the custom message
   *       this.onmessage(socket, message);
   *      }
   *   );
   * });
   */
  const serverOn = jest.fn((event, callback) => {
    // console.log(`server.on("${event}") called`);
    callback(socketMock);
  });

  /**
   * Mock for 'ws' module.
   * Contains only necessary method that is used in tests
   */
  const mockedWs = {
    Server: jest.fn().mockImplementation(() => {
      return {
        on: serverOn,
      };
    }),
  };

  /**
   * We use 'dirty' casting here to not to implement all the properties of 'ws' lib
   */
  return mockedWs as unknown as typeof ws;
}