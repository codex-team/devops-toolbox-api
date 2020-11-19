import { Message } from './message';

/**
 * Messages from the API sent in response to some client's message
 */
interface ResponseMessage extends Message {
  messageId: string | null;
}

export default ResponseMessage;
