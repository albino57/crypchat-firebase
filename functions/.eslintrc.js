module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  // Use overrides para diferentes tipos de arquivo
  overrides: [
    {
      files: ["src/**/*.ts"],
      extends: [
        "eslint:recommended",
        "google",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "quotes": ["error", "double"],
        "indent": ["error", 2],
        "max-len": ["error", { "code": 120 }],
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
      },
    },
    {
      files: ["*.js"],
      rules: {
        //Regras mais relaxadas para arquivos JS de configuração
        "no-undef": "off",
      },
    },
  ],
  ignorePatterns: [
    "lib/",
    "generated/",
    "*.config.js"
  ],
};