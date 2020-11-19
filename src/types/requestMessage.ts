import { Message } from './message';

/**
 * Message from client
 */
interface RequestMessage extends Message {
  messageId: string;
}

export default RequestMessage;
