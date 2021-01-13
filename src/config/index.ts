import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '/../../.env') });

/**
 * Class for settings (data from .env and etc)
 */
export default class Config {
  /**
   * The Port you are using for http connection
   */
  public static httpPort: number | undefined = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : undefined;
  /**
   * The Port you are using for web socket connection
   */
  public static wsPort: number | undefined = process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : undefined;
  /**
   * Database URL
   */
  public static dbUrl: string = process.env.DB_URL || '';
  /**
   * Workspaces config-file path
   */
  public static workspacesConfigPath: string = process.env.CONFIG_FILE || '';
  /**
   * Cron schedule
   */
  public static pingSchedule: string = process.env.SCHEDULE || '*/20 * * * * *';
}
