/**
 * Http error
 */
class HttpError extends Error {
  /**
   * Status code
   */
  public status: number;

  /**
   * Constructor
   *
   * @param status - status code
   * @param message - message
   */
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export default HttpError;
