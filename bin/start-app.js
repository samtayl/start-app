#!/usr/bin/env node

import startApp from '../src/startApp.js';
import createLogger from './utils/createLogger.js';

const logger = createLogger();

process.on('uncaughtException', (error) => {
  logger.error({message: error});
});

const server = await startApp({logger});

for (const eventName of ['SIGINT', 'SIGTERM']) {
  process.once(eventName, async () => {
    logger.debug('Stopping server');

    await server.stop();

    logger.verbose('Server stopped');
  });
}
