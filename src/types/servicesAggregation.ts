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
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  servicesList: any;
}
