# @chiastack/utils

A collection of utility functions for the Chiastack monorepo, providing common helpers for date manipulation, type checking, error handling, and more.

## Installation

```bash
pnpm add @chiastack/utils
```

## Peer Dependencies

This package requires the following peer dependencies:

- `dayjs`: `^1.11.19`
- `zod`: `^3.24.0 || ^4.0.0`

## Available Utilities

### Date Utilities (`day`)

Day.js wrapper with timezone support and common plugins pre-configured.

### Type Checking (`is`)

Type-safe validation utilities using Zod.

### Error Handling (`try-catch`)

Safe error handling utility that returns a Result object instead of throwing.

### Server Utilities (`server`)

Server-side helper functions for client IP detection and request handling.

### URL Utilities (`set-search-params`)

Utility for building URL query strings with type safety.

### Delay (`delay`)

Async delay utility for waiting between operations.

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

- `@chiastack/utils` - Main entry point (exports all utilities)
- `@chiastack/utils/day` - Date utilities
- `@chiastack/utils/delay` - Delay utility
- `@chiastack/utils/is` - Type checking utilities
- `@chiastack/utils/try-catch` - Error handling utility
- `@chiastack/utils/server` - Server-side utilities
- `@chiastack/utils/set-search-params` - URL query string utilities

## License

MIT
