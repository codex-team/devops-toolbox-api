/**
 * Interface for service
 */
interface Service {
  /**
   * Service type
   */
  type: string;
  /**
   * Service payload
   */
  payload: object | object[];
}

export default Service;
