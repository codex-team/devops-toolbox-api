/* eslint-disable no-new */

import { Transport, TransportOptions } from '../server';
import { createMessage } from './utils';
import { createWsMockWithMessage, socketClose, socketOnCloseMock, socketSend } from './ws.mock';

describe('Transport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Garbage collecting', () => {
    test('should remove a Client when client closes connection', () => {
      /**
       * Can't implement this test yet:
       * we can't imitate socket closing
       */
      expect(true).toBe(true);
    });

    test('should remove a Client when server closes connection', () => {
      /**
       * Can't implement this test yet:
       * we can't access socket.on('close')
       */
      expect(true).toBe(true);
    });

    test('should remove a Client when there is an error during connection', () => {
      /**
       * Can't implement this test yet:
       * we can't access socket.on('error')
       */
      expect(true).toBe(true);
    });
  });
});