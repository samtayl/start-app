import winston from 'winston';

const createLogger = ({level: levelArg} = {}) => {
  const logger = winston.createLogger({
    level: levelArg,
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        consoleWarnLevels: ['warn'],
        format: winston.format.combine(
          winston.format.errors({stack: true}),
          winston.format((info) => {
            const _info = {...info};

            if (_info.stack) {
              _info.message = _info.stack;
            }

            return _info;
          })(),
          winston.format.colorize(),
          winston.format.padLevels(),
          winston.format.printf(({level, message}) => `${level} ${message}`),
        ),
      }),
    ],
  });

  return logger;
};

export default createLogger;
