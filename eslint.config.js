export default {
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_|^next$' }],
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'no-throw-literal': 'error'
  },
  ignorePatterns: ['node_modules/', 'logs/', 'coverage/']
};
