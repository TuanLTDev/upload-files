import env from 'dotenv';

env.config();

class ConfigService {
    static ROOT_DIR = process.env.NODE_ENV === 'production' ? `${process.cwd()}/dist` : `${process.cwd()}/src`;

    static UPLOAD_FILE_DIR = `${this.ROOT_DIR}/${process.env.UPLOAD_FILE_DIR}`;

    static PREFIX_FILE_URL = `${process.env.APP_HOST}/${process.env.UPLOAD_FILE_DIR}`;

    static environment() {
        return process.env.NODE_ENV || 'development';
    }

    static appConfig() {
        return {
            port: process.env.APP_PORT || 3000,
            host: process.env.APP_HOST || 'http://localhost:3000',
            name: process.env.APP_NAME || 'Express Boilerplate',
            apiPrefix: process.env.API_PREFIX || '/api/v1',
            debug: process.env.APP_DEBUG === 'true',
            cors: process.env.APP_CORS_ORIGIN || '*',
        };
    }

    static jwtConfig() {
        return {
            accessSecret: process.env.JWT_ACCESS_SECRET || 'gdscdut',
            refreshSecret: process.env.JWT_REFRESH_SECRET || 'gdscdut',
            accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1d',
            refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
        };
    }

    static mongooseConfig() {
        return {
            scheme: process.env.DATABASE_SCHEME || 'mongodb',
            host: process.env.DATABASE_HOST || 'localhost',
            username: process.env.DATABASE_USER_NAME,
            password: process.env.DATABASE_USER_PASSWORD,
            port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
            databaseName: process.env.DATABASE_NAME,
            options: process.env.DATABASE_OPTIONS,
            mongoUri: process.env.MONGODB_URI,
        };
    }

    static cloudinaryConfig() {
        return {
            cloudinaryName: process.env.CLOUDINARY_NAME,
            cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
            cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
        };
    }

    static sentryConfig() {
        return {
            sentryDsn: process.env.SENTRY_DSN,
        };
    }

    static discordConfig() {
        return {
            discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
            discordBotName: process.env.DISCORD_BOT_NAME,
            discordBotAvatarUrl: process.env.DISCORD_BOT_AVATAR_URL,
        };
    }

    static encryptConfig() {
        return {
            encryptAlgorithm: process.env.ENCRYPT_ALGORITHM,
            encryptKey: Buffer.from(process.env.ENCRYPT_KEY, 'hex'),
        };
    }

    static amqpConfig() {
        return {
            url: process.env.AMQP_URL,
        };
    }
}

export default ConfigService;
