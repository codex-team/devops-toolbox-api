import Workspace from './workspace';

/**
 * Message can contain any data at payload
 */
export type MessagePayload = {
  workspaces?: Workspace[] | null;
};

/**
 * Any client-server message should fit this structure
 */
export interface Message {
  /**
   * Any payload like workspaces and etc.
   */
  payload: MessagePayload;
}
