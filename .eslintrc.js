module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'semi': ['error', 'never'],
    'global-require': 0,
    'no-unused-expressions': 'off',
    'no-lonely-if': 'off',
    'max-len': 0,
    'import/extensions': 0,
    'no-tabs': 0,
    'indent': 'off',
    'template-curly-spacing': 'off',
    'linebreak-style': 0,
    'object-shorthand': 0,
    'prefer-destructuring': ['error', { 'object': false, 'array': false }],
    'no-use-before-define': ["error", { "variables": false }],
    'no-multiple-empty-lines': [2, { "max": 99999, "maxEOF": 0 }],
    'quote-props': ["error", "as-needed"],
    'no-nested-ternary': "off",
    'no-underscore-dangle': "off",
    'consistent-return': "off",
    'arrow-body-style': "off",
    'no-else-return': "off",
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', 'src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue']
      }
    }
  }
};
