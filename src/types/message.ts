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
  payload: MessagePayload;
}
