/**
 * Transport options for class Transport
 */
interface TransportOptions {
  /**
   * The Port you are using for web socket connection
   */
  port: number;
  /**
   * Accept only connections matching this path
   */
  path?: string;
}

export default TransportOptions;
