import { Optional } from '@bafx/utils';

export type ILogFinal = (eventName: string, data: Optional<object | string>) => void;

export type ILogWithTraceId = {
  (correlationId: Optional<string>, eventName: string, operationName: string, data: Optional<object | string>): ILogFinal;
};

export type ILogWithTraceIdAndCorrelationId = {
  (eventName: string, operationName: string, data: Optional<object | string>): ILogFinal;
};

export type ILogWithTraceIdAndCorrelationIdAndOperationName = {
  (eventName: string, data: Optional<object | string>): ILogFinal;
};

export type ILogWithTraceIdAndOperationName = {
  (correlationId: Optional<string>, eventName: string, data: Optional<object | string>): ILogFinal;
};

export type ILog = {
  (traceId: Optional<string>, correlationId: Optional<string>, eventName: string, operationName: string, data: Optional<object | string>): void;
  (traceId: Optional<string>, correlationId: Optional<string>): ILogWithTraceIdAndCorrelationId;
  (traceId: Optional<string>, correlationId: Optional<string>, operationName: string): ILogWithTraceIdAndCorrelationIdAndOperationName;
  (traceId: Optional<string>, operationName: string): ILogWithTraceIdAndOperationName;
  (traceId: Optional<string>): ILogWithTraceId;
};

export type LogLevel = 'debug' | 'warn' | 'info' | 'error' | 'security';

export interface ILogger {
  /**
   * **debug** level - Vhodný pro logování debugovacích informací, které se vetšinou neobjeví v produkčních log souborech
   */
  debug: ILog;
  /**
   * **warn** level - Vhodný pro logování chyb se kterými se za běhu aplikace počítá
   */
  warn: ILog;
  /**
   * **info** level - Vhodný pro logování běžných informativních zpráv o tom, že se něco stalo
   */
  info: ILog;
  /**
   * **error** level - Vhodný pro logování chyb, které by se běžně neměli stávat. Tyto log záznamy by se následně měli řešit jako incident
   */
  error: ILog;
  /**
   * **security** level - Vhodný pro logování bezpečnostních událostí jako jsou pokusy o neoprávněný přístup, podezřelé aktivity, nebo změny v bezpečnostních nastaveních.
   */
  security: ILog;
}

export interface ILoggerWithTraceId {
  debug: ILogWithTraceId;
  warn: ILogWithTraceId;
  info: ILogWithTraceId;
  error: ILogWithTraceId;
  security: ILogWithTraceId;
  traceId: string;
}

export interface ILoggerWithTraceIdAndCorrelationId {
  debug: ILogWithTraceIdAndCorrelationId;
  warn: ILogWithTraceIdAndCorrelationId;
  info: ILogWithTraceIdAndCorrelationId;
  error: ILogWithTraceIdAndCorrelationId;
  security: ILogWithTraceIdAndCorrelationId;
  traceId: string;
  correlationId: string;
}

export interface ILoggerWithTraceIdAndCorrelationIdAndOperationName {
  debug: ILogWithTraceIdAndCorrelationIdAndOperationName;
  warn: ILogWithTraceIdAndCorrelationIdAndOperationName;
  info: ILogWithTraceIdAndCorrelationIdAndOperationName;
  error: ILogWithTraceIdAndCorrelationIdAndOperationName;
  security: ILogWithTraceIdAndCorrelationIdAndOperationName;
  traceId: string;
  operationName: string;
  correlationId: string;
}

export interface ILoggerWithTraceIdAndOperationName {
  debug: ILogWithTraceIdAndOperationName;
  warn: ILogWithTraceIdAndOperationName;
  info: ILogWithTraceIdAndOperationName;
  error: ILogWithTraceIdAndOperationName;
  security: ILogWithTraceIdAndOperationName;
  traceId: string;
  operationName: string;
}

export interface IBaseLoggerData {
  action: string;
  userName?: string;
  result?: string;
}

export interface IConfig {
  /**
   * Název informačního systému
   */
  informationSystem: string;
  /**
   * Prostředí, ve kterém loguje aplikace
   */
  environment: string;
  /**
   * Cesta ke složce, kde se ukládají logovací soubory.
   */
  directory?: string;
  /**
   * Název souboru v případě, že se loguje do souboru.
   */
  fileName?: string;
  /**
   * Název služby v daném {@link hostname}
   */
  serviceName: string;
  /**
   * Úroveň logování (defaultně "info")
   */
  level?: string;
  /**
   * Označení verze buildu
   */
  version?: string;
  /**
   * Adresa syslog serveru
   */
  syslogServer?: string;
  /**
   * Port syslog serveru
   */
  syslogPort?: number;
  /**
   * Pokud false, tak logger nebude logovat do console.
   * Užitečné pro šetření místa na disku pokud už loguji do souboru.
   */
  enableConsoleLog?: boolean;
}
