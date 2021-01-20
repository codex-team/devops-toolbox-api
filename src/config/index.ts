import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '/../../.env') });

/**
 * Class for settings (data from .env and etc)
 */
export default class Config {
  /**
   * Host for listening by server
   */
  public static host: string = process.env.HOST || '127.0.0.1';

  /**
   * The Port you are using for http connection
   */
  public static httpPort: number = parseInt(process.env.HTTP_PORT, 10);
  /**
   * The Port you are using for web socket connection
   */
  public static wsPort: number = parseInt(process.env.WS_PORT, 10);
  /**
   * Database URL
   */
  public static dbUrl: string = process.env.DB_URL || '';
  /**
   * Workspaces config-file path
   */
  public static workspacesConfigPath: string = process.env.CONFIG_FILE || '';
}
