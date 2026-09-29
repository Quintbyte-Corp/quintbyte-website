import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design reference package (prototype code, not part of the app)
    "design_handoff_quintbyte_website/**",
    // Showreel renderer (standalone Node project with its own tooling)
    "marketing/**",
  ]),
]);

export default eslintConfig;
