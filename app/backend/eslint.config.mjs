import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

export default [
  { ignores: ["node_modules/**", "dist/**"] },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { babelrc: false, configFile: false, plugins: ["@babel/plugin-syntax-typescript"] },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript 7 is ahead of typescript-eslint's supported peer range.
      // tsc checks names/unused declarations; ESLint checks executable logic.
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "eqeqeq": "error",
    },
  },
];
