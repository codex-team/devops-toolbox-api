import { nanoid } from 'nanoid';
import { IncomingMessage } from '../types';

/**
 * Return message in format of protocol.
 * Message id will be generated.
 *
 * @param type - message type
 * @param payload - message payload
 */
export function createMessage({ type, payload }: { type: string; payload: object }): string {
  return JSON.stringify(
    {
      messageId: nanoid(10),
      type,
      payload,
    } as IncomingMessage
  );
}