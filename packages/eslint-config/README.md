# ESLint Config Package (@repo/eslint-config)

This internal package centralizes the ESLint configurations for the GrindLink monorepo. By sharing a common set of rules, we ensure code consistency, quality, and adherence to best practices across all applications and packages.

---

## 📦 Configurations

This package exports several configurations tailored for different environments:

*   **`base.js`**: The foundational configuration. It includes rules for standard JavaScript, TypeScript (`typescript-eslint`), and Prettier integration to prevent style conflicts. It also includes rules for Turborepo (`eslint-plugin-turbo`).

*   **`next.js`**: Extends the `base` configuration with rules specifically for our Next.js 14 application (`apps/web`). This includes React-specific rules (`eslint-plugin-react`, `eslint-plugin-react-hooks`) and Next.js performance and correctness rules (`@next/eslint-plugin-next`).

*   **`react-internal.js`**: A configuration for any future internal packages or libraries that use React but are not full Next.js applications.

---

## Usage

Other projects within this monorepo can use these shared configurations by extending them in their own `eslint.config.mjs` (or similar) file.

For example, the `apps/web` project uses the `next.js` configuration like this:

```javascript
// In apps/web/eslint.config.mjs

import { nextJsConfig } from "@repo/eslint-config/next-js";

export default [
  ...nextJsConfig,
  // You can add or override rules specific to this app here
];
