module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    graphql: true,
  },
  extends: 'react-app',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
  },
}
