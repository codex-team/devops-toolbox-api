import { Transport, TransportOptions } from '../transport';
import { createWsMockWithMessage, socketSend } from './ws.mock';
import { createMessage, createMessageId } from './utils';
import { NewMessage } from '../types';

/**
 * Mock of external onAuth method that will do app-related authorisation
 */
const onAuthMock = jest.fn();

/**
 * Mock of external onMessage method that will do app-related message handling
 */
const onMessageMock = jest.fn();

describe('Transport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    /**
     * This mocks out setTimeout and other timer functions with mock functions
     */
    jest.useFakeTimers();
  });

  describe('Responding', () => {
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
        disableLogs: true,
      } as TransportOptions, new ws.Server());

      /**
       * Message series will be processed with some delay (see ws.mock.ts@socketOnMock)
       * Wait until all messages will be processed.
       */
      setTimeout(() => {
        expect(onAuthMock).toBeCalledTimes(1); // auth proceeded
        expect(onMessageMock).toBeCalledWith(secondMessagePayload); // onMessage called
      }, 50);
    });

    test('should send a response if the "onMessage" returns somethig', () => {
      const onMessageResponse = {
        someData: '123',
      };
      const onMessageWithReturnValue = jest.fn(() => {
        return Promise.resolve(onMessageResponse);
      });
      const secondMessageId = createMessageId();

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
        JSON.stringify({
          messageId: secondMessageId,
          type: 'some-message-type',
          payload: {},
        } as NewMessage),
      ];
      const ws = createWsMockWithMessage(undefined, messageSeries);

      // eslint-disable-next-line no-new
      new Transport({
        onAuth: onAuthMock,
        onMessage: onMessageWithReturnValue,
        disableLogs: true,
      } as TransportOptions, new ws.Server());

      /**
       * Message series will be processed with some delay (see ws.mock.ts@socketOnMock)
       * Wait until all messages will be processed.
       */
      setTimeout(() => {
        expect(socketSend).toHaveBeenCalledWith(JSON.stringify({
          messageId: secondMessageId,
          paylaod: onMessageResponse,
        }));
      }, 50);
    });

    test('should not send anything if the "onMessage" throws error', () => {
      const onMessageWithReturnValue = jest.fn(() => {
        throw Error('Some internal error');
      });

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
          type: 'some-message-type',
          payload: {},
        }),
      ];
      const ws = createWsMockWithMessage(undefined, messageSeries);

      // eslint-disable-next-line no-new
      new Transport({
        onAuth: onAuthMock,
        onMessage: onMessageWithReturnValue,
        disableLogs: true,
      } as TransportOptions, new ws.Server());

      /**
       * Message series will be processed with some delay (see ws.mock.ts@socketOnMock)
       * Wait until all messages will be processed.
       */
      setTimeout(() => {
        expect(socketSend).toHaveBeenCalledTimes(0);
      }, 50);
    });
  });
});