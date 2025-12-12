# TypeScript Config Package (@repo/typescript-config)

This internal package provides a set of shared `tsconfig.json` files for use across the GrindLink monorepo. Centralizing these configurations ensures that all our projects adhere to the same strictness levels and compiler options, promoting code consistency and reducing boilerplate.

---

## 📦 Configurations

This package exports several base configurations that can be extended by applications and other packages.

### `base.json`
This is the foundational configuration that all other configs extend. It includes the strictest and most common rules that should apply to all TypeScript code in the repository.
*   **Key Settings:** `strict: true`, `esModuleInterop: true`, `noUncheckedIndexedAccess: true`, `moduleResolution: "NodeNext"`.

### `nextjs.json`
This configuration is specifically tailored for our **Next.js 14** application (`apps/web`). It extends `base.json` and adds options required by the Next.js compiler.
*   **Key Settings:** `jsx: "preserve"`, `module: "ESNext"`, `plugins: [{ "name": "next" }]`, `noEmit: true`.

### `react-library.json`
This configuration is designed for any future internal packages that use React but are not full Next.js applications (e.g., a shared component library). It extends `base.json` with the necessary JSX settings.
*   **Key Settings:** `jsx: "react-jsx"`.

---

## Usage

To use a shared configuration, an application or package simply needs to use the `extends` property in its own `tsconfig.json` file.

**Example from `apps/web/tsconfig.json`:**
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
