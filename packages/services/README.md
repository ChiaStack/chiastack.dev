# @chiastack/services

A collection of service integrations for the Chiastack monorepo, providing utilities for CAPTCHA verification and other common service integrations.

## Installation

```bash
pnpm add @chiastack/services
```

## Peer Dependencies

This package requires the following peer dependency:

- `@chiastack/utils`

## Available Services

### CAPTCHA Verification (`captcha`)

Provides integration with Cloudflare Turnstile and Google reCAPTCHA for verifying CAPTCHA tokens in server-side applications.

**Features:**

- Support for Cloudflare Turnstile
- Support for Google reCAPTCHA
- Automatic client IP detection
- Type-safe error handling

## Development

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm type:check
```

### Lint

```bash
pnpm lint
```

### Test

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Clean

```bash
pnpm clean
```

## Exports

This package uses subpath exports for better tree-shaking:

- `@chiastack/services/captcha` - CAPTCHA verification service

## License

MIT
