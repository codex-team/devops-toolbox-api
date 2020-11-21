import { Message } from './message';

/**
 * Messages from the API sent in response to some client's message
 */
interface ResponseMessage extends Message {
  /**
   * Message id which we use to send response with this id
   */
  messageId: string;
}

export default ResponseMessage;
