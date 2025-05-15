import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    ignores: ["node_modules/**", "pnpm-lock.yaml"],
    files: ["src/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        console: "readonly",
      },
    },
    rules: {
      "import/no-cycle": "error",
      "no-console": "error",
      "no-unused-vars": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/infra",
              from: ["./src/index.js", "./src/app"],
              message: "Dependency prohibited",
            },
            {
              target: "./src/app",
              from: ["./src/index.js"],
              message: "Dependency prohibited",
            },
          ],
        },
      ],
    },
  },
];
