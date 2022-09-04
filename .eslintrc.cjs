/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "vue/first-attribute-linebreak": "off",
    "vue/max-attributes-per-line": "off"
  },
  "ignorePatterns": ["docs", "node_modules"] 
}
