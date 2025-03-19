import { createLogger, format, transports } from 'winston';
import { join } from 'path';

const { combine, timestamp, printf, colorize, splat, simple } = format;

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        // show log on console
        new transports.Console({
            level: 'info',
            format: combine(
                simple(),
                splat(),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                colorize(),
                printf((log) => {
                    if (log.stack) return `[${log.timestamp}] [${log.level}] [${log.stack}]`;
                    return `[${log.timestamp}] [${log.level}] [${log.message}]`;
                }),
            ),
        }),
        new transports.File({
            filename: join(process.cwd(), 'logs/errors.log'),
            level: 'error',
            format: simple(),
        }),
    ],
});

export { logger };
