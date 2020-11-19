/**
 * Message that initiated by the API
 */
import { Message } from './message';

interface OutgoingMessage extends Message {
  type: string;
}

export default OutgoingMessage;
