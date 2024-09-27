const pino = require('pino');
const pretty = require('pino-pretty');
const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
});
export const logger = pino({ level: 'info' }, stream);
