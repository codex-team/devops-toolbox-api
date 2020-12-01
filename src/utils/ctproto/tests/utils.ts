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
 * @param message - message to create
 * @param message.type - action type
 * @param message.payload - data to send
 */
export function createMessage({ type, payload }: Pick<NewMessage, 'type' | 'payload'>): string {
  return JSON.stringify(
    {
      messageId: createMessageId(),
      type,
      payload,
    } as NewMessage
  );
}
