import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

/**
 * Class for settings (data from .env and etc)
 */
class Config {
  /**
   * The Port you are using for http connection
   */
  public static httpPort: number = +process.env.HTTP_PORT!;
  /**
   * The Port you are using for web socket connection
   */
  public static wsPort: number = +process.env.WS_PORT!;
  /**
   * Database URL
   */
  public static dbUrl: string = process.env.DB_URL!;
  /**
   * Workspaces config-file path
   */
  public static wsUrl: string = process.env.CONFIG_FILE! || '../config.yml';
}

export default Config;
