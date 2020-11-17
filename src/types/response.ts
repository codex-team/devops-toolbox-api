/**
 * Interface for response
 */
interface Response {
  /**
   * Message id, which we use to send response with this id
   */
  messageId: string | null;
  /**
   * Type of request
   */
  type: string;
  /**
   * The Payload
   */
  payload: object;
}

export default Response;
