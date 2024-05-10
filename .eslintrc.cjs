module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vitest.config.ts", "vite.config.ts", "tailwind.config.ts", "postcss.config.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  root: true,
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
