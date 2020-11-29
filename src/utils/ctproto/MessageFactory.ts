import { MessagePayload, NewMessage, ResponseMessage } from './types';
import { nanoid } from 'nanoid';

/**
 * Class for creating of messages
 */
export default class MessageFactory {
  /**
   * Creates the NewMessage
   *
   * @param type - message action type
   * @param payload - data to send
   */
  public static create(type: string, payload: MessagePayload): string {
    return JSON.stringify({
      type,
      payload,
      messageId: MessageFactory.createMessageId(),
    } as NewMessage);
  }

  /**
   * Creates the RespondMessage
   *
   * @param messageId - id of a message to respond
   * @param payload - data to send
   */
  public static respond(messageId: string, payload: MessagePayload): string {
    return JSON.stringify({
      messageId,
      payload,
    } as ResponseMessage);
  }

  /**
   * Creates the NewMessage for error answer
   *
   * @param error - text to send as error
   */
  public static createError(error: string): string {
    return JSON.stringify({
      type: 'error',
      payload: {
        error,
      },
      messageId: MessageFactory.createMessageId(),
    } as NewMessage);
  }

  /**
   * Creates unique message id
   */
  private static createMessageId(): string {
    return nanoid(10);
  }
}
