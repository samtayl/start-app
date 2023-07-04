# start-app

- Serves an application from a file
- Reads a config from a file and passes it to the application
- Logs clearly and passes the logger to the application

## Installation

**npm:**

```sh
npm i @samtayl/start-app
```

**yarn:**

```sh
yarn i @samtayl/start-app
```

## Usage

Create an `app.js` file in the package directory. This must export a function which returns a request handler for the server.

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

### Configuring your app

Create a `config.json` file in the package directory. This object will be passed to the exported function in the `app.js` file.

```JSON
{
  "greeting": "Hello, World! :3"
}
```

```JS
export default function(options) {
  return function(req, res) {
    res.end(options.greeting); // "Hello, World! :3"
  };
};
```

### Configuring `start-app`

These `config.json` properties will change the behaviour of `start-app`:

| `config.json` property | type     | format                                                                  | default       | description                                     |
| ---------------------- | -------- | ----------------------------------------------------------------------- | ------------- | ----------------------------------------------- |
| `appPath`              | `string` | A pathname relative to where the `start-app` command is ran.            | `"app.js"`    | The pathname of the file which your app is in.  |
| `logLevel`             | `string` | One of 'silly', 'debug', 'verbose', 'http', 'info', 'warn', or 'error'. | `"info"`      | The log level which should be displayed.        |
| `port`                 | `number` | A valid port.                                                           | `8000`        | The port which the server should listen on.     |
| `hostname`             | `string` | A valid hostname.                                                       | `"127.0.0.1"` | The hostname which the server should listen on. |

#### CLI options and environment variables

`start-app` uses [`convict`](https://github.com/mozilla/node-convict/tree/master/packages/convict) to validate it's configuration and to enable a hierarchy of configuration methods. As such, the previously listed `config.json` properties are also available as the following command line arguments and environment variables:

| `config.json` property | command line argument | environment variable |
| ---------------------- | --------------------- | -------------------- |
| `appPath`              | `--appPath`           | `APP_PATH`           |
| `logLevel`             | `--logLevel`          | `LOG_LEVEL`          |
| `port`                 | `--port`              | `PORT`               |
| `hostname`             | `--hostname`          | `HOSTNAME`           |

Lastly, the path of the config file can also be changed:

| command line argument | environment variable | format                                                       | default         | description                                       |
| --------------------- | -------------------- | ------------------------------------------------------------ | --------------- | ------------------------------------------------- |
| `--configPath`        | `CONFIG_PATH`        | A pathname relative to where the `start-app` command is ran. | `"config.json"` | The pathname of the file which your config is in. |

### Custom config schema

Create a `configSchema.js` file. This must export a `convict` instance as demonstrated by [their documentation](https://github.com/mozilla/node-convict/tree/master/packages/convict#usage).

```JS
import convict from 'convict';

export default convict({
  greeting: {
    doc: 'The greeting to give',
    format: String,
    default: 'Hello. World. :|',
    env: 'GREETING',
    arg: 'greeting',
  },
});
```

Your configuration in `config.json` will now be validated against this schema. You may override the `config.json` properties listed above to change default values or command line argument and environment variable names.

## Logging

The logger used to output from `start-app` will also be passed to your app. It is a [`winston`](https://github.com/winstonjs/winston) instance.

```JS
export default function(options, logger) {
  return function(req, res) {
    logger.info("Hello, Console! :[]");

    res.end("Hello, World! :3");
  };
};
```
