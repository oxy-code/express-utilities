const winston = require('winston');
const util = require('util');
const { printf, timestamp, combine } = winston.format;
const { LEVEL, LABEL, SPLAT } = require('triple-beam');
/**
 * Custom Format
 * for human readable logs
 */
const customFormat = printf(({ level, message, label, timestamp, ...meta }) => {
  if (meta[LEVEL]) delete meta[LEVEL];
  if (meta[SPLAT]) delete meta[SPLAT];
  if (meta[LABEL]) delete meta[LEVEL];
  const isDataAvailable = Object.keys(meta).length;
  
  if (label) {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}` + (isDataAvailable ? util.format(' %O', meta) : '');
  }
  return `${timestamp} ${level.toUpperCase()}: ${message}` + (isDataAvailable ? util.format(' %O', meta) : '');
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    customFormat,
  ),
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}
else {
  //
  // - Write all logs with importance level of `error` or higher to `error.log`
  //   (i.e., error, fatal, but not other levels)
  //
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  //
  // - Write all logs with importance level of `info` or higher to `app.log`
  //   (i.e., fatal, error, warn, and info, but not trace)
  //
  logger.add(new winston.transports.File({ filename: 'app.log' }));
}

module.exports = logger;