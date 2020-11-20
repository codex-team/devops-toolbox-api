import { Message, MessagePayload, OutgoingMessage, ResponseMessage } from './types';

/**
 * Class for creating message
 */
export default class MessageCreator {
  /**
   * Method which creates message
   *
   * @param type - type of response
   * @param messageId - message id, which we use to send response with this id (If API send message then messageId is null)
   * @param payload - any payload like workspace and etc.
   */
  public static create(type: string, messageId: string | null, payload: MessagePayload): OutgoingMessage | ResponseMessage {
    const message: Message = {
      payload,
    };

    if (messageId) {
      return {
        payload: message.payload,
        messageId,
      };
    }

    return {
      payload: message.payload,
      type,
    };
  }
}
