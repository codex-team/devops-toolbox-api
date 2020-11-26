import { nanoid } from 'nanoid';
import { NewMessage } from '../types';


/**
 * Generates message id in CTProto format
 */
export function createMessageId(): string {
  return nanoid(10);
}

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
      messageId: createMessageId(),
      type,
      payload,
    } as NewMessage
  );
}
