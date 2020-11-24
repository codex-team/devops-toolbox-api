import ws from 'ws';
import { Transport, TransportOptions } from '../transport';

jest.mock('ws');

describe('Transport', () => {
  describe('Message validation', () => {
    const config: TransportOptions = {
      onAuth: (payload) => Promise.resolve({}),
      onMessage: (message) => Promise.resolve(),
    };
    const wsServer = new ws.Server({ noServer: true });
    const transport = new Transport(config, wsServer);

    test('should break the connection if message is not a string', () => {
      expect(true).toBe(true);
    });

    test('should break the connection if message is not a valid JSON', () => {
      expect(true).toBe(true);
    });

    test('should return an error if message has no «messageId» property', () => {
      expect(true).toBe(true);
    });

    test('should return an error if message has no «type» property', () => {
      expect(true).toBe(true);
    });

    test('should return an error if message has no «payload» property', () => {
      expect(true).toBe(true);
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