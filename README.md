# start-app

- Serves an application from a file
- Reads a config from a file and passes it to the application
- Logs clearly and passes the logger to the application

## Installation

```sh
npm i @samtayl/start-app
```

## Usage

Create a file called `app.js` file in the directory that `start-app` is executed. This must export a function which returns a request handler for the server.

```JS
export default function() {
  return function(req, res) {
    res.end('Hello, World! :3');
  };
};
```

Run `start-app` to start the server and serve the app.

By default, the server listens at `http://127.0.0.1:8000`.

## Configuration

`start-app` uses [`convict`](https://github.com/mozilla/node-convict/tree/master/packages/convict) to manage it's configuration. It uses configuration schemas to define the configuration variables that can be set. The variables you set will be validated by `start-app`'s internal schema and your custom schema and then passed to the function exported in `app.js`.

### Setting configuration variables

Configuration variables can be set in three ways: through a configuration file, through environment variables, and through command line arguments. Only variables defined in either `start-app`'s internal schema or your custom schema can be set.

#### Using a configuration file

Create a file called `config.json` in the directory that `start-app` is executed.

```JSON
{
  "port": 80
}
```

##### Changing the configuration file location

The default location of the configuration file is `config.json` in the directory that `start-app` is executed. Since the location of the configuration file is itself a configuration variable, a different location can be set by the `CONFIG_FILE` environment variable or the `--configFile` command line argument.

#### Using environment variables

```sh
cross-env PORT=80 npm start-app
```

NOTE: [`cross-env`](https://www.npmjs.com/package/cross-env) is a seperate package used to set environment variables consistently accross platforms.

#### Using command line arguments

```sh
npm start-app --port 80
```

#### Using configuration variables inside your app

The variables set through each of the three methods are combined into a single object and passed to the function exported in the `app.js` file.

```JS
export default function(options) {
  return function(req, res) {
    console.log(options.port) // 80

    res.end('Hello, World! :3');
  };
};
```

### Configuring `start-app`

`start-app` has these configuration variables:

| config file property | command line argument | environment variable | type     | format                                                                  | default             | description                                              |
| -------------------- | --------------------- | -------------------- | -------- | ----------------------------------------------------------------------- | ------------------- | -------------------------------------------------------- |
| `appPath`            | `--appPath`           | `APP_PATH`           | `string` | A pathname relative to where the `start-app` command is executed.       | `"app.js"`          | The pathname of the file which your app is in.           |
| `logLevel`           | `--logLevel`          | `LOG_LEVEL`          | `string` | One of 'silly', 'debug', 'verbose', 'http', 'info', 'warn', or 'error'. | `"info"`            | The log level which should be displayed.                 |
| `port`               | `--port`              | `PORT`               | `number` | A valid port.                                                           | `8000`              | The port which the server should listen on.              |
| `hostname`           | `--hostname`          | `HOSTNAME`           | `string` | A valid hostname.                                                       | `"127.0.0.1"`       | The hostname which the server should listen on.          |
|                      | `--configPath`        | `CONFIG_PATH`        | `string` | A pathname relative to where the `start-app` command is executed.        | `"config.json"`     | The pathname of the file which your config is in.        |
|                      | `--configSchemaPath`  | `CONFIG_SCHEMA_PATH` | `string` | A pathname relative to where the `start-app` command is executed.        | `"configSchema.js"` | The pathname of the file which your config schema is in. |

### Configuring your app

A configuration schema is an object defining the configuration variables that can be set. To set variables not defined by `start-app`'s internal schema, you must create a custom schema.

#### Custom configuration schema

Create a file called `configSchema.js` in the directory that `start-app` is executed.

This must export an object with a convict schema as demonstrated by [their documentation](https://github.com/mozilla/node-convict/tree/master/packages/convict#usage):

```JS
export default {
  greeting: {
    doc: 'The greeting to give',
    format: String,
    default: 'Hello. World. :|',
    env: 'GREETING',
    arg: 'greeting',
  },
};
```

##### Changing the configuration schema file location

The default location of the custom schema file is `configSchema.js` in the directory that `start-app` is executed. Like the configuration file location, the custom schema file location is also a configuration variable, and can be set by the `CONFIG_SCHEMA_PATH` environment variable and the `--configSchemaPath` command line argument.

##### Overwriting `start-app`'s configuration schema

Your custom schema will be merged with `start-app`'s internal schema. This means you can overwrite `start-app`'s configuration variables to change the environment variable and command line argument names, in case the default names conflicted with another package, as well as all other properties. However, you should not change the format, as this will cause errors in places where a variable is expected to have it's original type.

## Logging

The logger used to output from `start-app` will also be passed to the function exported in the `app.js` file. It is a [`winston`](https://github.com/winstonjs/winston) instance.

```JS
export default function(options, logger) {
  return function(req, res) {
    logger.info("Hello, Console! :[]");

    res.end("Hello, World! :3");
  };
};
```
