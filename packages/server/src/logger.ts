import winston from 'winston';

export const createLogger = (env: string) => {
    return winston.createLogger({
        level: env === 'DEV' ? 'debug' : 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.align(),
                    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
                ),
            }),
        ],
    });
};
