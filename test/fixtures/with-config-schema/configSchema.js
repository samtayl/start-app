import convict from 'convict';

export default convict({
  port: {
    doc: 'The port for the server to listen on',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
});
