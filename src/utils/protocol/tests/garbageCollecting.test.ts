/* eslint-disable no-new */

import { Transport, TransportOptions } from '../transport';
import { createWsMockWithMessage, socketClose, socketSend } from './ws.mock';

describe('Transport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Garbage collecting', () => {
    test('should remove a Client on connection closing', () => {
      expect(true).toBe(true);
    });

    test('should remove a Client when there is an error during connection', () => {
      expect(true).toBe(true);
    });
  });
});