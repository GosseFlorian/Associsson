import eslintConfigPrettier from 'eslint-config-prettier';

export default [
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
