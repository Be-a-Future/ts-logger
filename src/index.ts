import { curry, Optional } from '@bafx/utils';
import { createLogger, format, addColors, Logger } from 'winston';
import { IConfig, ILogger, LogLevel } from './interfaces';
import { customLevels, customFormat, getTransports } from './config';

export * from './interfaces';
export * from './mocks';
export * from './utils/logger';
export * from './utils/formatting';
export * from './utils/typedLogger';

const createLogFunction = (logger: Logger, level: LogLevel) =>
  curry((traceId: Optional<string>, correlationId: Optional<string>, eventName: string, operationName: string, data: Optional<object | string>) =>
    logger.log(level, eventName, { traceId, correlationId, eventName, operationName, data }),
  );

/**
 * Returns a configured logger instance
 */
export const getLogger = (config: IConfig): ILogger => {
  addColors(customLevels.colors);

  const logger = createLogger({
    levels: customLevels.levels,
    defaultMeta: {
      informationSystem: config.informationSystem,
      environment: config.environment,
      version: config.version,
      service: config.serviceName,
      operationName: '',
    },
    exitOnError: false,
    format: format.combine(format.timestamp(), format.json(), customFormat),
    transports: getTransports(config),
  });

  logger.on('error', (error) => {
    console.error(`Logger on error: `, error);
  });

  // Create a logger instance with methods for each log level
  return {
    debug: createLogFunction(logger, 'debug'),
    warn: createLogFunction(logger, 'warn'),
    info: createLogFunction(logger, 'info'),
    error: createLogFunction(logger, 'error'),
    security: createLogFunction(logger, 'security'),
  };
};
