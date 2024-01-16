const configSchema = {
  port: {
    doc: 'The port for the server to listen on',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
};

export default configSchema;
