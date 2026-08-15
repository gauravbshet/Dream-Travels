import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

// eslint-config-next@15.5.23 still ships old eslintrc-style shareable
// configs ({ extends: [...] }), not the ESLint 9 flat-config array this
// file uses. FlatCompat bridges the two — same pattern Next's own project
// scaffolding uses.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code tooling/skill scaffolding — CommonJS scripts, not app
    // source, and not meant to be linted against the app's TS/React config.
    ".claude/**",
    ".agents/**",
  ]),
]);

export default eslintConfig;
