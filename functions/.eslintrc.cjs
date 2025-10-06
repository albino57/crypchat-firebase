module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, //Diz ao ESLint para reconhecer o ambiente Node.js
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "google",
  ],

  parser: "@typescript-eslint/parser", //Diz ao ESLint para usar o novo tradutor
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },

  ignorePatterns: [
    "/lib/**/*", 
  ],

  plugins: [
    "@typescript-eslint",
  ],

  rules: {
    "quotes": ["error", "double"],
    "indent": "off", // Desativa a regra de indentação que pode conflitar
    "require-jsdoc": "off",
  },

};