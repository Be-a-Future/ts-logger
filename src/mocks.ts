/* eslint-disable no-console */
import { curry } from '@bafx/utils';
import { ILogger } from './interfaces';

export const loggerMocked: ILogger = {
  error: curry((traceId: string, correlationId: string, eventName: string, operationName: string, data: object | string) =>
    console.log({ level: 'error', traceId, correlationId, eventName, operationName, data }),
  ),
  warn: curry((traceId: string, correlationId: string, eventName: string, operationName: string, data: object | string) =>
    console.log({ level: 'warn', traceId, correlationId, eventName, operationName, data }),
  ),
  debug: curry((traceId: string, correlationId: string, eventName: string, operationName: string, data: object | string) =>
    console.log({ level: 'debug', traceId, correlationId, eventName, operationName, data }),
  ),
  info: curry((traceId: string, correlationId: string, eventName: string, operationName: string, data: object | string) =>
    console.log({ level: 'info', traceId, correlationId, eventName, operationName, data }),
  ),
  security: curry((traceId: string, correlationId: string, eventName: string, operationName: string, data: object | string) =>
    console.log({ level: 'security', traceId, correlationId, eventName, operationName, data }),
  ),
};
