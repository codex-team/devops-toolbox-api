/**
 * Interface for service
 */
export interface Service {
  /**
   * Service type
   */
  type: string;
  /**
   * Service payload
   */
  payload: object | object[];
}
