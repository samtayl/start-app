import {pathToFileURL} from 'url';
import convict from 'convict';
import express from 'express';
import morgan from 'morgan';
import baseConfigManager from './baseConfigSchema.js';
import {readJsonFileThatMayNotExist} from './file.js';
import Server from './Server.js';

const startApp = async function({logger}) {
  const appConfigManagerModulePath = baseConfigManager.get('configSchemaPath');
  const appConfigManagerModuleURL = pathToFileURL(appConfigManagerModulePath);
  let appConfigManager;

  try {
    const appConfigManagerModule = await import(appConfigManagerModuleURL);

    appConfigManager = appConfigManagerModule.default;
  }
  catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      appConfigManager = convict({});
    }
    else {
      throw error;
    }
  }

  const getSharedConfigValue = (name) => (
    appConfigManager.has(name)
      ? appConfigManager.get(name)
      : baseConfigManager.get(name)
  );

  logger.level = getSharedConfigValue('logLevel');

  const appConfigPath = getSharedConfigValue('configPath');

  logger.debug(`Reading config file at ${appConfigPath}`);

  const appConfigFileContents = await readJsonFileThatMayNotExist(appConfigPath);

  if (appConfigFileContents) {
    logger.debug(`Loading config file at ${appConfigPath}`);

    baseConfigManager.load(appConfigFileContents);
    appConfigManager.load(appConfigFileContents);

    logger.level = getSharedConfigValue('logLevel');

    logger.verbose(`Loaded config file at ${appConfigPath}`);
  }
  else {
    logger.verbose(`No config file found at ${appConfigPath}`);
  }

  logger.debug(`Using config: ${appConfigManager.toString()}`);

  const wrapperApp = express();

  wrapperApp.use(morgan('dev', {
    stream: {
      write(message) {
        logger.http(message.trim());
      },
    },
  }));

  const createAppModulePath = getSharedConfigValue('appPath');
  const createAppModuleURL = pathToFileURL(createAppModulePath);
  const createAppModule = await import(createAppModuleURL);
  const createApp = createAppModule.default;

  logger.debug('Creating application');

  const app = await createApp(appConfigManager.getProperties(), logger);

  logger.verbose('Created application');

  wrapperApp.use(app);

  wrapperApp.use((error, req, res, next) => {
    logger.error({message: error});

    res.set('Content-Type', 'text/plain');
    res.status(500);
    res.send(error.message);
  });

  const server = new Server(wrapperApp);
  const port = getSharedConfigValue('port');
  const hostname = getSharedConfigValue('hostname');

  logger.debug(`Starting server at http://${hostname}:${port}`);

  await server.start({port, host: hostname});

  const {
    family: boundFamily,
    address: boundHostname,
    port: boundPort,
  } = server.server.address();

  const boundHostnameString = boundFamily === 'IPv6'
    ? `[${boundHostname}]`
    : boundHostname;

  logger.info(
    `Server started at http://${boundHostnameString}:${boundPort}`,
  );

  return server;
};

export default startApp;
