import dotenv from 'dotenv';

dotenv.config();

class Config {
    static port = process.env.PORT;
}

export default Config;