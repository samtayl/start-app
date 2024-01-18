import {pathToFileURL} from 'url';
import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';
import express from 'express';
import morgan from 'morgan';
import baseConfigSchema from './baseConfigSchema.js';
import {readJsonFileThatMayNotExist} from './file.js';
import Server from './Server.js';

convict.addFormats(convictFormatWithValidator);

const startApp = async function({logger}) {
  const baseConfigManager = convict(baseConfigSchema);
  const appConfigSchemaModulePath = baseConfigManager.get('configSchemaPath');
  const appConfigSchemaModuleURL = pathToFileURL(appConfigSchemaModulePath);
  let appConfigSchema;

  try {
    const appConfigSchemaModule = await import(appConfigSchemaModuleURL);

    appConfigSchema = appConfigSchemaModule.default;
  }
  catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      appConfigSchema = {};
    }
    else {
      throw error;
    }
  }

  const mergedConfigSchema = Object.assign({}, baseConfigSchema, appConfigSchema);
  const appConfigManager = convict(mergedConfigSchema);

  logger.level = appConfigManager.get('logLevel');

  const appConfigPath = appConfigManager.get('configPath');

  logger.debug(`Reading config file at ${appConfigPath}`);

  const appConfigFileContents = await readJsonFileThatMayNotExist(appConfigPath);

  if (appConfigFileContents) {
    logger.debug(`Loading config file at ${appConfigPath}`);

    baseConfigManager.load(appConfigFileContents);
    appConfigManager.load(appConfigFileContents);

    logger.level = appConfigManager.get('logLevel');

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

  const createAppModulePath = appConfigManager.get('appPath');
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

  const server = new Server({logger}, wrapperApp);
  const port = appConfigManager.get('port');
  const hostname = appConfigManager.get('hostname');

  server.start(port, hostname);

  return server;
};

export default startApp;
