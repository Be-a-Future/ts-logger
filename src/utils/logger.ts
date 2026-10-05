import { curry, Optional } from '@bafx/utils';
import * as uuid from 'uuid';
import {
  ILogger,
  ILoggerWithTraceId,
  ILoggerWithTraceIdAndCorrelationId,
  ILoggerWithTraceIdAndCorrelationIdAndOperationName,
  ILoggerWithTraceIdAndOperationName,
} from '../interfaces';
import { defaultUUID } from './formatting';

/**
 * Generates new traceId
 */
export const generateTraceId: () => string = uuid.v4;

type ApplyTraceId = {
  (traceId: Optional<string>): (logger: ILogger) => ILoggerWithTraceId;
  (traceId: Optional<string>, logger: ILogger): ILoggerWithTraceId;
};

export const applyTraceId: ApplyTraceId = curry((traceId: string | undefined, logger: ILogger): ILoggerWithTraceId => ({
  debug: logger.debug(traceId),
  info: logger.info(traceId),
  warn: logger.warn(traceId),
  error: logger.error(traceId),
  security: logger.security(traceId),
  traceId: traceId || defaultUUID(),
}));

type ApplyTraceIdAndCorrelationId = {
  (traceId: Optional<string>, correlationId: Optional<string>): (logger: ILogger) => ILoggerWithTraceIdAndCorrelationId;
  (traceId: Optional<string>, correlationId: Optional<string>, logger: ILogger): ILoggerWithTraceIdAndCorrelationId;
};

export const applyTraceIdAndCorrelationId: ApplyTraceIdAndCorrelationId = curry(
  (traceId: string | undefined, correlationId: string | undefined, logger: ILogger): ILoggerWithTraceIdAndCorrelationId => ({
    debug: logger.debug(traceId, correlationId),
    info: logger.info(traceId, correlationId),
    warn: logger.warn(traceId, correlationId),
    error: logger.error(traceId, correlationId),
    security: logger.security(traceId, correlationId),
    traceId: traceId || defaultUUID(),
    correlationId: correlationId || defaultUUID(),
  }),
);

type ApplyOperationName = {
  (operationName: string): {
    (logger: ILoggerWithTraceIdAndCorrelationId): ILoggerWithTraceIdAndCorrelationIdAndOperationName;
    (logger: ILoggerWithTraceId): ILoggerWithTraceIdAndOperationName;
  };
  (operationName: string, logger: ILoggerWithTraceIdAndCorrelationId): ILoggerWithTraceIdAndCorrelationIdAndOperationName;
  (operationName: string, logger: ILoggerWithTraceId): ILoggerWithTraceIdAndOperationName;
};

export const applyOperationName: ApplyOperationName = curry((operationName: string, logger: ILoggerWithTraceId | ILoggerWithTraceIdAndCorrelationId) => {
  const hasCorrelationId = 'correlationId' in logger;

  if (hasCorrelationId) {
    return {
      debug: (eventName: string, data: Optional<object | string>) => logger.debug(eventName, operationName, data),
      info: (eventName: string, data: Optional<object | string>) => logger.info(eventName, operationName, data),
      warn: (eventName: string, data: Optional<object | string>) => logger.warn(eventName, operationName, data),
      error: (eventName: string, data: Optional<object | string>) => logger.error(eventName, operationName, data),
      security: (eventName: string, data: Optional<object | string>) => logger.security(eventName, operationName, data),
      traceId: logger.traceId,
      correlationId: logger.correlationId,
      operationName,
    } as ILoggerWithTraceIdAndCorrelationIdAndOperationName;
  }

  return {
    debug: (correlationId: Optional<string>, eventName: string, data: Optional<object | string>) => logger.debug(correlationId, eventName, operationName, data),
    info: (correlationId: Optional<string>, eventName: string, data: Optional<object | string>) => logger.info(correlationId, eventName, operationName, data),
    warn: (correlationId: Optional<string>, eventName: string, data: Optional<object | string>) => logger.warn(correlationId, eventName, operationName, data),
    error: (correlationId: Optional<string>, eventName: string, data: Optional<object | string>) => logger.error(correlationId, eventName, operationName, data),
    security: (correlationId: Optional<string>, eventName: string, data: Optional<object | string>) => logger.security(correlationId, eventName, operationName, data),
    traceId: logger.traceId,
    operationName,
  } as ILoggerWithTraceIdAndOperationName;
});

const bool = <T>(a: T) => !!a;

export const appendWhen =
  <R, K>(itemFactory: () => R, condition: K) =>
  <T>(arr: T[]): Array<T | R> | Array<T> => {
    return bool(condition) ? [...arr, itemFactory()] : arr;
  };
