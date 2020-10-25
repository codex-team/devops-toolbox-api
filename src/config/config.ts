import dotenv from 'dotenv';

dotenv.config();
/**
 * Class for settings (data from .env and etc)
 */
class Config {
    /**
     * The Port you are using
     */
    static port: number = +process.env.PORT!;
}

export default Config;
