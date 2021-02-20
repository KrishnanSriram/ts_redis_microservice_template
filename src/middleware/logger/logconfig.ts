import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
const infoLogTransport = new winston.transports.DailyRotateFile({
    filename: "app-%DATE%.log",
    dirname: './logs',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: process.env.LOG_LEVEL,
});
infoLogTransport.on('rotate', function (oldFilename, newFilename) {
    // call function like upload to s3 or on cloud
});

const errorLogTransport = new winston.transports.DailyRotateFile({
    filename: './error-%DATE%.log',
    dirname: './logs',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
});

errorLogTransport.on('rotate', function (oldFilename, newFilename) {
    // call function like upload to s3 or on cloud
});

const Logger = winston.createLogger({
    format: logFormat,
    transports: [
        infoLogTransport,
        errorLogTransport,
        new winston.transports.Console({
            level: 'info',
        }),
    ],
});

export default Logger;