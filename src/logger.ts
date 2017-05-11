import * as path from 'path';
import * as winston from 'winston';

export default function createLogger(sourceFile: string): winston.LoggerInstance {
    const transports = [
        new winston.transports.Console({
            label: path.basename(sourceFile),
            timestamp: true,
            colorize: process.env.NODE_ENV === 'development',
            level: process.env.LOG_LEVEL || 'debug'
        })
    ];
    return new winston.Logger({
        transports: transports
    });
}