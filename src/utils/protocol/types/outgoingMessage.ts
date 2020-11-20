import { Message } from './message';

/**
 * Message that initiated by the API
 */
interface OutgoingMessage extends Message {
  /**
   * Type of request like 'getWorkspaces' and etc. (If API send message then type is 'workspace-update')
   */
  type: string;
}

export default OutgoingMessage;
