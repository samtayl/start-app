import http from 'http';
import {promisify} from 'util';

const SERVER_STATES = {
  STARTING: Symbol('STARTING'),
  STARTED: Symbol('STARTED'),
  STOPPING: Symbol('STOPPING'),
  STOPPED: Symbol('STOPPED'),
};

class Server {
  server = http.createServer();
  listen = promisify(this.server.listen).bind(this.server);
  close = promisify(this.server.close).bind(this.server);
  state = SERVER_STATES.STOPPED;

  // depending on how soon after the server begins to start that 'Server.stop()'
  // is called, it may be too soon to close the server without encountering
  // a 'server not running' error, yet too late to attach a listener to the
  // 'listening' event to close it once listening. However, it is not so late
  // that the 'Server.listen()' call inside 'Server.start()' has resolved, and
  // so a flag variable can be toggled to close the server once it resolves.

  shouldStop = false;

  constructor(options = {}, requestListener) {
    let _options = options;
    let _requestLitener = requestListener;

    if (requestListener === undefined && typeof options === 'function') {
      _requestLitener = options;
      _options = {};
    }

    this.logger = _options.logger;

    if (_requestLitener) {
      this.server.on('request', _requestLitener);
    }
  }

  async start(port, hostname) {
    this.state = SERVER_STATES.STARTING;

    this.logger.debug(`Starting server at http://${hostname}:${port}`);

    await this.listen(port, hostname);

    this.state = SERVER_STATES.STARTED;

    const {
      family: boundFamily,
      address: boundHostname,
      port: boundPort,
    } = this.server.address();

    const boundHostnameString = boundFamily === 'IPv6'
      ? `[${boundHostname}]`
      : boundHostname;

    this.logger.info(
      `Server started at http://${boundHostnameString}:${boundPort}`,
    );

    if (this.shouldStop) {
      await this.stop();

      this.shouldStop = false;
    }
  }

  async stop() {
    if (this.state === SERVER_STATES.STARTING) {

      this.shouldStop = true;

      this.logger.verbose('Server is still starting. Will stop when started');
    }
    else if (this.state === SERVER_STATES.STARTED) {
      this.state = SERVER_STATES.STOPPING;

      this.logger.debug('Stopping server');

      await this.close();

      this.state = SERVER_STATES.STOPPED;

      this.logger.verbose('Server stopped');
    }
    else if (this.state === SERVER_STATES.STOPPING) {
      this.logger.verbose('Server is already stopping');
    }
    else {
      this.logger.verbose('Server has already stopped');
    }
  }
}

export default Server;
