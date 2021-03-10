/**
 * Interface for server
 */
export default interface ServicesAggregation {
  /**
   * ID of aggregation
   */
  _id: string;

  /**
   * List of projects with type of service
   */
  servicesList: {
    type: string,
    projectName: string[],
  };
}
