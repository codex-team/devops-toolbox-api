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

/**
 * HTTP status codes
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export enum HttpStatusCode {
  /**
   * The server can not find the requested resource. In the browser, this means the URL is not recognized.
   * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
   * Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.
   * This response code is probably the most famous one due to its frequent occurrence on the web.
   */
  NotFound = 404,
}
