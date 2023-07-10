module.exports = {
  root: true,
  extends: [
    '@samtayl',
    '@samtayl/node',
    '@samtayl/import',
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
  overrides: [
    {
      files: [
        'test/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};
