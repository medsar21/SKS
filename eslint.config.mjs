import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default defineConfig([
  globalIgnores([
    ".next/**",
    ".next-test/**",
    "src/generated/**",
    "playwright-report/**",
    "test-results/**",
    "test-results-public/**",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    files: ["**/*.tsx"],
    extends: [hooks.configs.flat.recommended, a11y.flatConfigs.recommended],
  },
]);
