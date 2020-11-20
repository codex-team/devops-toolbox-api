import { Message } from './message';

/**
 * Message from client
 */
interface RequestMessage extends Message {
  /**
   * Message id which we use to send response with this id
   */
  messageId: string;
}

export default RequestMessage;
