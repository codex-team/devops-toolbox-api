import { Message } from './message';

/**
 * Message that initiated by the API
 */
interface OutgoingMessage extends Message {
  /**
   * If API send message then messageId is null
   */
  messageId: null;
  /**
   * Type of message
   */
  type: string;
}

export default OutgoingMessage;
