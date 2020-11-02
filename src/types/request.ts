/**
 * Interface for typing requests
 */
interface Request {
  /**
   * Message id, which we use to send response with this id
   */
  messageId: string;
  /**
   * Type of request
   */
  type: string;
}

export default Request;
