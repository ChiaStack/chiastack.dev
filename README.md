# Chia Stack

![og](./.github/public/og.png)

A modern TypeScript utility library collection providing practical utilities, service integrations, and UI components for building modern applications.

## ✨ Features

- 🚀 **Modern Stack**: TypeScript, React 19, Next.js 16
- 📦 **Modular**: Each package can be used independently
- 🔒 **Type Safe**: Full TypeScript support
- ⚡ **Performant**: Optimized code
- 🛠️ **Monorepo**: Managed with Turborepo and pnpm workspace

## 📦 Packages

### `@chiastack/utils`

Utility functions library

### `@chiastack/services`

Service integrations

### `@chiastack/ui`

React UI component library

### `@chiastack/eslint` & `@chiastack/tsconfig`

Shared ESLint and TypeScript configurations

## 🚀 Quick Start

```bash
pnpm add @chiastack/utils
pnpm add @chiastack/services
pnpm add @chiastack/ui
```

### Usage

```typescript
import { captchaSiteverify } from "@chiastack/services/captcha";
import { delay, tryCatch, day } from "@chiastack/utils";

// Delay execution
await delay(1000);

// Safe error handling
const result = await tryCatch(fetch("/api/data"));

// Date formatting
const formatted = day().format("YYYY-MM-DD");

// CAPTCHA verification
const response = await captchaSiteverify(request, {
  provider: "cloudflare-turnstile",
  captchaSecretKey: process.env.CAPTCHA_SECRET_KEY!,
});
```

## 🛠️ Development

**Requirements**: Node.js >= 22.\*, pnpm >= 10.22.0

```bash
pnpm install
pnpm dev      # Start dev server
pnpm build    # Build all packages
pnpm test     # Run tests
pnpm lint     # Lint code
```

## 📚 Documentation

Full documentation: [chiastack.dev](https://chiastack.dev)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 👤 Author

### Chia1104

- GitHub: [@chia1104](https://github.com/chia1104)
- Email: [yuyuchia7423@gmail.com](mailto:yuyuchia7423@gmail.com)
