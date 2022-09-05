/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  rules: {
    'vue/first-attribute-linebreak': 'off',
    'vue/max-attributes-per-line': 'off',
  },
  ignorePatterns: ['docs', 'node_modules'],
};
