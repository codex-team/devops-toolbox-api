/**
 * Interface for server
 */
export default interface ServicesAggregation {
  /**
   * ID of aggregation
   */
  _id: string;

  /**
   * List of services
   */
  servicesList: unknown;
}
