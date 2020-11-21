import RequestMessage from './requestMessage';

/**
 * Message that initiated by the client
 */
interface IncomingMessage extends RequestMessage {
  /**
   * Type of request
   */
  type: string;
}

export default IncomingMessage;