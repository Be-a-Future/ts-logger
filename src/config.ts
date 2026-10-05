import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Syslog } from 'winston-syslog';
import * as Transport from 'winston-transport';
import { pipe } from '@bafx/utils';
import { IConfig } from './interfaces';
import { appendWhen } from './utils';
import { Format } from 'logform';
import { formatLogMessage } from './utils';

export const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    security: 2,
    notice: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    security: 'magenta',
    notice: 'blue',
    info: 'green',
    debug: 'grey',
  },
};

export const customFormat: Format = format.printf((props) => formatLogMessage(props));

/**
 * Returns an array of transports for winston logger
 */
export const getTransports = (config: IConfig): Transport[] =>
  pipe(
    [],
    appendWhen(
      () =>
        new transports.Console({
          level: config.level || 'debug',
          format: format.combine(format.colorize(), format.timestamp(), format.json(), customFormat),
          handleExceptions: true,
        }),
      config.enableConsoleLog,
    ),
    appendWhen(
      () =>
        new DailyRotateFile({
          level: config.level || 'info',
          dirname: config.directory,
          filename: `${config.fileName || 'log.%DATE%'}`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxFiles: '30d',
          utc: true,
          handleExceptions: true,
        }),
      config.directory,
    ),
    appendWhen(
      () =>
        new Syslog({
          host: config.syslogServer,
          port: config.syslogPort,
          protocol: 'udp',
          type: '5424',
          level: config.level || 'info',
          handleExceptions: true,
        }),
      config.syslogServer && config.syslogPort,
    ),
  );
