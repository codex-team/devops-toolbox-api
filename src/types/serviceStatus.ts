/**
 * Status of service in workspace
 */
export default interface ServiceStatus {
  /**
   * Name of service
   */
  name: string;

  /**
   * State of service (online/offline)
   */
  isOnline: boolean;
}
