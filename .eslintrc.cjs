module.exports = {
  root: true,
  extends: [
    '@samtayl',
    '@samtayl/import',
    '@samtayl/node',
  ],
  env: {
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: [
          'modules',
          'dynamicImport',
        ],
      },
    ],
  },
};
