import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
  }),
);

// Define transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

export class Logger {
  private logger: winston.Logger;
  private debugMode: boolean;

  constructor(debugMode: boolean) {
    this.debugMode = debugMode;
    this.logger = winston.createLogger({
      level: this.debugMode ? 'debug' : 'info',
      levels,
      format,
      transports,
    });
  }

  setDebugMode(debugMode: boolean) {
    this.debugMode = debugMode;
    this.logger.level = this.debugMode ? 'debug' : 'info';
    this.info(`Logger level changed to ${this.logger.level}`);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }
}
