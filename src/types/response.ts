/**
 * Interface for response
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
  /**
   * The Payload
   */
  payload: object;
}

export default Request;
