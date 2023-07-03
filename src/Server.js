import http from 'http';

const closeServer = async function(server) {
  return await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

class Server {
  constructor(options = {}, requestListener) {
    let _options = options;
    let _requestLitener = requestListener;

    if (requestListener === undefined && typeof options === 'function') {
      _requestLitener = options;
      _options = {};
    }

    this.server = http.createServer(_options, _requestLitener);
  }

  async start(options) {
    return await new Promise((resolve, reject) => {
      this.server.listen(options, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  async stop() {
    try {
      return await closeServer(this.server);
    }
    catch (error1) {
      if (error1.code === 'ERR_SERVER_NOT_RUNNING') {
        return await new Promise((resolve, reject) => {
          this.server.once('listening', () => {
            closeServer(this.server)
              .then(
                () => {
                  resolve();
                },
                (error2) => {
                  reject(error2);
                },
              );
          });
        });
      }

      throw error1;
    }
  }
}

export default Server;
