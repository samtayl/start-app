import path, {dirname as getDirname} from 'path';
import {fileURLToPath} from 'url';
import {execaNode} from 'execa';

const filepath = fileURLToPath(import.meta.url);
const dirname = getDirname(filepath);
const startAppFilepath = path.resolve(dirname, '../bin/start-app.js');

const extractHostnameAndPort = async function(stdout) {
  return await new Promise((resolve) => {
    let output = '';

    stdout.on('data', (data) => {
      output += data;

      const match = output.match(/Server started at http:\/\/(.+):(\d+)\s*$/u);

      if (match) {
        const [, hostname, port] = match;

        resolve({hostname, port});
      }
    });
  });
};

test('start an app with the default hostname and port', async () => {
  const defaultFixturesDirname = path.resolve(dirname, 'fixtures/default');
  const startAppFilepathFromDefaultFixtures = path.relative(defaultFixturesDirname, startAppFilepath);

  const childProcess = execaNode(
    startAppFilepathFromDefaultFixtures,
    [],
    {cwd: defaultFixturesDirname},
  );

  const {hostname, port} = await extractHostnameAndPort(childProcess.stdout);

  childProcess.kill();

  expect(hostname).toEqual('127.0.0.1');
  expect(port).toEqual('8000');
});

test('start an app and pass a custom config', async () => {
  const withConfigFixturesDirname = path.resolve(dirname, 'fixtures/with-config');
  const startAppFilepathFromWithConfigFixtures = path.relative(withConfigFixturesDirname, startAppFilepath);

  const childProcess = execaNode(
    startAppFilepathFromWithConfigFixtures,
    [],
    {cwd: withConfigFixturesDirname},
  );

  const {hostname, port} = await extractHostnameAndPort(childProcess.stdout);

  childProcess.kill();

  expect(hostname).toEqual('127.0.0.1');
  expect(port).toEqual('5000');
});

test('start an app and pass a custom config schema', async () => {
  const withConfigSchemaFixturesDirname = path.resolve(dirname, 'fixtures/with-config-schema');
  const startAppFilepathFromWithConfigSchemaFixtures = path.relative(withConfigSchemaFixturesDirname, startAppFilepath);

  const childProcess = execaNode(
    startAppFilepathFromWithConfigSchemaFixtures,
    [],
    {cwd: withConfigSchemaFixturesDirname},
  );

  const {hostname, port} = await extractHostnameAndPort(childProcess.stdout);

  childProcess.kill();

  expect(hostname).toEqual('127.0.0.1');
  expect(port).toEqual('3000');
});
