/**
 * Override the 'express' type to specify type for the modified app.locals
 */

declare namespace Express {
  /**
   * express.Application with modified 'locals' property
   *
   * @see https://expressjs.com/en/api.html#app.locals
   */
  export interface Application {
    /**
     * Useful data accessible through all the application
     * Restricted by the single Request context
     */
    context: import('./appContext').default;
  }
}
