import path from "node:path";
import { fileURLToPath } from "node:url";

import eslintJs from "@eslint/js";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

import importPlugin from "eslint-plugin-import";
import security from "eslint-plugin-security";

import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsxA11yRecommended = jsxA11y.configs.recommended?.rules ?? {};

const jsxA11yOff = Object.fromEntries(Object.keys(jsxA11yRecommended).map((rule) => [rule, "off"]));

// --- Проверка TS-пресетов ---
const tsTypeChecked = typescriptPlugin.configs["recommended-type-checked"];

if (!tsTypeChecked?.rules) {
  throw new Error(
    '[eslint.config.mjs] Не найден @typescript-eslint preset "recommended-type-checked".',
  );
}

const tsRecommended = typescriptPlugin.configs.recommended;

if (!tsRecommended?.rules) {
  throw new Error('[eslint.config.mjs] Не найден @typescript-eslint preset "recommended".');
}

export default [
  {
    ignores: [
      "eslint.config.js",
      "eslint.config.mjs",
      "text.ts",
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
      "coverage/**",
    ],
  },

  // Core recommended
  eslintJs.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021,
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": typescriptPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      import: importPlugin,
      security,
    },

    rules: {
      // TypeScript
      ...tsRecommended.rules,
      ...tsTypeChecked.rules,

      // React
      ...(react.configs.recommended?.rules ?? {}),

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/function-component-definition": "off",
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unstable-nested-components": "off",
      "react/no-array-index-key": "error",
      "react/jsx-no-bind": "off",
      "react/jsx-no-constructed-context-values": "error",
      "react/no-danger": "error",

      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],

      // A11y
      ...jsxA11yOff,

      // Import
      "import/order": "off",
      "import/no-cycle": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",

      // Security
      "security/detect-object-injection": "off",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-possible-timing-attacks": "warn",

      // Sort / unused
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",

      // TypeScript strict
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-shadow": "error",

      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["arrowFunctions"],
        },
      ],

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/restrict-template-expressions": "error",

      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-meaningless-void-operator": "error",
      "@typescript-eslint/return-await": "error",

      // Общие
      "no-empty": "off",

      "no-param-reassign": [
        "error",
        {
          props: false,
        },
      ],

      "array-bracket-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],

      camelcase: "off",
      "no-underscore-dangle": "off",
      "no-restricted-syntax": "off",

      "react/destructuring-assignment": "off",
      "react/no-unescaped-entities": "off",
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        alias: {
          map: [["@", path.resolve(__dirname, "src")]],
          extensions: [".ts", ".js", ".jsx", ".json", ".tsx"],
        },
      },
    },
  },

  // Prettier
  prettierConfig,
];
