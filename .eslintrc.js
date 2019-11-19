module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'import'
  ],
  rules: {
    'comma-dangle': ["error", "never"],
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'no-console': ['error', { allow: ['tron'] }],
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }],
    'no-param-reassign': 'off',
    'camelcase': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off'
  },
};
