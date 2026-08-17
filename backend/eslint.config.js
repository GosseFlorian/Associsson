const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-unreachable': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  eslintConfigPrettier,
];
