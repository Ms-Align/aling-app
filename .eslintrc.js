module.exports = {
  env: {
    browser: true,

    es2021: true,
  },
  ignorePatterns: ["config/*"],
  extends: [
    "eslint:recommended",

    "plugin:@typescript-eslint/recommended",

    "plugin:react/recommended",
  ],

  overrides: [
    {
      env: {
        node: true,
      },

      files: [".eslintrc.{js,cjs}"],

      parserOptions: {
        sourceType: "script",
      },
    },
  ],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",

    sourceType: "module",
  },

  plugins: ["@typescript-eslint", "react", "prettier"],

  rules: {
    //"linebreak-style": ["error", "windows"],
    "no-unused-vars": "off", //允许未使用的申明
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off", //允许使用any
    "react/display-name": "off",
    "no-extra-semi": "off",
  },
}
