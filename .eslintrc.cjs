/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
    '@vue/eslint-config-airbnb-with-typescript/allow-js-in-vue',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': 'off',
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'beside',
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 3,
      },
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never',
    }],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: false,
      ignores: [],
    }],
  },
  ignorePatterns: ['dist', 'node_modules'],
};
