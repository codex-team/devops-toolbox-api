import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '/../../.env') });

declare const process : {
  env: {
    HTTP_PORT: number,
    WS_PORT: number,
    WS_PATH: string,
    DB_URL: string,
    CONFIG_FILE: string,
  }
};

/**
 * Class for settings (data from .env and etc)
 */
export default class Config {
  /**
   * The Port you are using for http connection
   */
  public static httpPort: number = process.env.HTTP_PORT || 8080;
  /**
   * The Port you are using for web socket connection
   */
  public static wsPort: number = process.env.WS_PORT || 3000;
  /**
   * Database URL
   */
  public static dbUrl: string = process.env.DB_URL || '';
  /**
   * Workspaces config-file path
   */
  public static workspacesConfigPath: string = process.env.CONFIG_FILE || '../config.yml';
  /**
   * Accept only connections matching this path.
   */
  public static wsPath: string = process.env.WS_PATH || '';
}
