/**
 * Message that initiated by the client
 */
import RequestMessage from './requestMessage';

interface IncomingMessage extends RequestMessage {
  type: string;
}

export default IncomingMessage;
