import path from 'path';

const baseConfigSchema = {
  env: {
    doc: 'The environment of the application',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env',
  },
  configPath: {
    doc: 'The path of the config file',
    format: String,
    default: path.resolve(process.cwd(), 'config.json'),
    env: 'CONFIG_PATH',
    arg: 'configPath',
  },
  configSchemaPath: {
    doc: 'The path of the config schema file',
    format: String,
    default: path.resolve(process.cwd(), 'configSchema.js'),
    env: 'CONFIG_SCHEMA_PATH',
    arg: 'configSchemaPath',
  },
  appPath: {
    doc: 'The path of the app file',
    format: String,
    default: path.resolve(process.cwd(), 'app.js'),
    env: 'APP_PATH',
    arg: 'appPath',
  },
  logLevel: {
    doc: 'The level to log',
    format: ['silly', 'debug', 'verbose', 'http', 'info', 'warn', 'error'],
    default: 'info',
    env: 'LOG_LEVEL',
    arg: 'logLevel',
  },
  port: {
    doc: 'The port for the server to listen on',
    format: 'port',
    default: 8000,
    env: 'PORT',
    arg: 'port',
  },
  hostname: {
    doc: 'The hostname of the server',
    format: String,
    default: '127.0.0.1',
    env: 'HOSTNAME',
    arg: 'hostname',
  },
};

export default baseConfigSchema;
