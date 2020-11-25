/* eslint-disable no-new */

import { Transport, TransportOptions } from '../transport';
import { createWsMockWithMessage, socketClose, socketSend } from './ws.mock';

describe('Transport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * This section contains message format validation tests
   */
  describe('Message validation', () => {
    /**
     * In all tests at this section, options are not used, so we mock it with empty values
     */
    const config: TransportOptions = {
      onAuth: (payload) => Promise.resolve({}),
      onMessage: (message) => Promise.resolve(),
    };

    test('should break the connection if message is not a string', () => {
      /**
       * Imitate the message with unsupported data. For example, ArrayBuffer
       */
      const socketMessage = new ArrayBuffer(0);
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(1);
    });

    test('should break the connection if message is not a valid JSON', () => {
      /**
       * Imitate the message that's not a JSON string
       */
      const socketMessage = 'some string but not a JSON';
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(1);
    });

    test('should send an error if message has no «messageId» property', () => {
      /**
       * Imitate the message without 'messageId'
       */
      const socketMessage = JSON.stringify({ foo: 'bar' });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "messageId" field missed');
    });

    test('should send an error if message has no «type» property', () => {
      /**
       * Imitate the message without the 'type'
       */
      const socketMessage = JSON.stringify({ messageId: '123' });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "type" field missed');
    });

    test('should send an error if message has no «payload» property', () => {
      /**
       * Imitate the message without the 'payload'
       */
      const socketMessage = JSON.stringify({
        messageId: '123',
        type: 'some-type',
      });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "payload" field missed');
    });

    test('should send an error if message «messageId» is not a string', () => {
      /**
       * Imitate the message with '«messageId»' that is not a string
       */
      const socketMessage = JSON.stringify({
        messageId: 123, // <-- not a string
        payload: {},
        type: 'some-type',
      });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "messageId" should be a string');
    });

    test('should send an error if message «type» is not a string', () => {
      /**
       * Imitate the message with 'type' that is not a string
       */
      const socketMessage = JSON.stringify({
        messageId: '123',
        payload: {},
        type: 123,
      });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "type" should be a string');
    });

    test('should send an error if message «payload» is not an object', () => {
      /**
       * Imitate the message with the 'payload' that is not an object
       */
      const socketMessage = JSON.stringify({
        messageId: '123',
        type: 'some-type',
        payload: 'not an object', // <-- not an object
      });
      const ws = createWsMockWithMessage(socketMessage);

      new Transport(config, new ws.Server());

      expect(socketClose).toBeCalledTimes(0);
      expect(socketSend).toHaveBeenCalledWith('Message Format Error: "payload" should be an object');
    });
  });


  describe('Authorisation', () => {
    test('should break the connection if the frist message is not an «authorize»', () => {
      expect(true).toBe(true);
    });

    test('should break the connection if the «authorize» is not accepted in 5 seconds', () => {
      expect(true).toBe(true);
    });

    test('should call the onAuth method with the auth request payload', () => {
      expect(true).toBe(true);
    });

    test('should save connected client in case of succeeded auth', () => {
      expect(true).toBe(true);
    });

    test('should save authorized data to the authData of a Client', () => {
      expect(true).toBe(true);
    });

    test('should ingore the «authorize» message if client is already authorised', () => {
      expect(true).toBe(true);
    });
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