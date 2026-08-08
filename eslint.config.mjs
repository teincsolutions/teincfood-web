import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  {
    rules: {
      "no-unused-vars": [
        "error",
        { args: "after-used", argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;