import { Transport, TransportOptions } from '../transport';
import { createWsMockWithMessage, socketClose, socketSend } from './ws.mock';
import { createMessage } from './utils';
import { CloseEventCode } from '../closeEvent';
import { AuthData } from '../types/auth';

/**
 * Mock of external onAuth method that will do app-related authorisation
 */
const onAuthMock = jest.fn();

/**
 * Mock of external onMessage method that will do app-related message handling
 */
const onMessageMock = jest.fn();

/**
 * Mock 'ws', create Transport with mocked 'ws'
 * And imitate accepting the first message with passed data
 *
 * @param message - message to imitate its accepting
 */
function createTransportWithFirstMessage(message?: {type: string; payload: object}): Transport {
  const socketMessage = message ? createMessage(message) : undefined;
  const ws = createWsMockWithMessage(socketMessage);

  return new Transport({
    onAuth: onAuthMock,
    onMessage: onMessageMock,
    // disableLogs: true,
  } as TransportOptions, new ws.Server());
}

describe('Transport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    /**
     * This mocks out setTimeout and other timer functions with mock functions
     */
    jest.useFakeTimers();
  });

  describe('Authorisation', () => {
    test('should break the connection if the frist message is not an «authorize»', () => {
      /**
       * Imitate the message with type 'some-action'
       */
      createTransportWithFirstMessage({
        type: 'some-action', // <-- not an 'authorize'
        payload: {},
      });

      expect(socketClose).toBeCalledTimes(1);
    });

    test('should break the connection if the «authorize» is not accepted in 3 seconds', () => {
      /**
       * Create transport, but do not pass any message to it
       */
      createTransportWithFirstMessage();

      /**
       * At this point in time, the socket.close() shouldn't have been called yet
       */
      expect(socketClose).not.toBeCalled();

      /**
       * Fast-forward until all timers have been executed
       */
      jest.advanceTimersByTime(3000);

      /**
       * Now the socket.close() should have been called
       */
      expect(socketClose).toBeCalled();
      expect(socketClose).toHaveBeenCalledTimes(1);
    });

    test('should call the "onAuth()" method with the auth request payload', () => {
      const authDataSample = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      };

      /**
       * Imitate the 'authorize' message
       */
      createTransportWithFirstMessage({
        type: 'authorize',
        payload: authDataSample,
      });

      expect(onAuthMock).toBeCalledWith(authDataSample);
    });

    test('should close connection if app-related "onAuth()" throws an error', () => {
      /**
       * Imitate onAuth throwing error
       */
      const appRealtedAuthError = new Error('No user found');
      const unsuccessfullOnAuth = jest.fn(() => {
        throw appRealtedAuthError;
      });

      const ws = createWsMockWithMessage(createMessage({
        type: 'authorize',
        payload: {},
      }));

      // eslint-disable-next-line no-new
      new Transport({
        onAuth: unsuccessfullOnAuth,
        onMessage: onMessageMock,
        disableLogs: true,
      } as TransportOptions, new ws.Server());

      expect(unsuccessfullOnAuth).toThrowError(appRealtedAuthError);
      expect(socketClose).toHaveBeenCalledWith(CloseEventCode.PolicyViolation, 'Authorization failed: ' + appRealtedAuthError.message);
    });

    test('should send authData in case of succeeded auth', () => {
      const authRequestMock = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      };
      const authDataMock = {
        user: '1234',
      };
      const successfullOnAuth = jest.fn((_authRequestPaylaod) => {
        return Promise.resolve(authDataMock);
      });

      const ws = createWsMockWithMessage(createMessage({
        type: 'authorize',
        payload: authRequestMock,
      }));

      // eslint-disable-next-line no-new
      new Transport({
        onAuth: successfullOnAuth,
        onMessage: onMessageMock,
        disableLogs: true,
      } as TransportOptions, new ws.Server());

      expect(successfullOnAuth).toBeCalledWith(authRequestMock);
      // expect(socketSend).toBeCalledWith(expect.stringMatching(/type="auth-success"/));
      expect(socketSend).toBeCalled();
    });

    test('should save authorized data to the authData of a Client', () => {
      expect(true).toBe(true);
    });

    test('should ingore the «authorize» message if client is already authorised', () => {
      expect(true).toBe(true);
    });

    /**
     * Check the second message accepting
     */
    describe('accepting the second message', () => {
      test('should call the "onMessage()" after succeeded auth', () => {
        const secondMessagePayload = {
          someData: '123',
        };

        /**
         * Imitate accpeting two messages
         */
        const messageSeries = [
          createMessage({
            type: 'authorize',
            payload: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
          }),
          createMessage({
            type: 'some-other-type',
            payload: secondMessagePayload,
          }),
        ];
        const ws = createWsMockWithMessage(undefined, messageSeries);

        // eslint-disable-next-line no-new
        new Transport({
          onAuth: onAuthMock,
          onMessage: onMessageMock,
          // disableLogs: true,
        } as TransportOptions, new ws.Server());

        expect(onMessageMock).toBeCalledWith(secondMessagePayload);
      });
    });
  });
});