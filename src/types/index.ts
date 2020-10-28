/**
 * Interface for typing requests
 */
interface Request{
  /**
   * Workspace token?
   */
  messageId: string;
  /**
   * Type of request
   */
  type: string;
}

export { Request };
