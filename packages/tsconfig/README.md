# @chiastack/tsconfig

Shared TypeScript configuration package for all projects in the Chiastack monorepo.

## Installation

```bash
pnpm add -D @chiastack/tsconfig
```

## Available Configurations

### `base.json`

Base TypeScript configuration suitable for all project types. Includes:

- **Modern ES2022 target**
- **Strict mode**: Enables all strict checking options
- **Bundler module resolution**: Uses `moduleResolution: "Bundler"` and `module: "Preserve"`
- **Incremental compilation**: Optimizes compilation performance in monorepos
- **No emit**: `noEmit: true`, compilation is handled by bundlers

### `react.json`

React project configuration that extends `base.json`. Additionally includes:

- **DOM types**: Includes `dom` and `dom.iterable` libraries
- **JSX support**: `jsx: "preserve"`, JSX transformation is handled by bundlers

**Usage example:**

```json
{
  "extends": "@chiastack/tsconfig/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `nestjs.json`

NestJS project configuration optimized for backend applications. Includes:

- **CommonJS module system**
- **Decorator support**: `experimentalDecorators` and `emitDecoratorMetadata`
- **Declaration generation**: `declaration: true`
- **Source maps**: `sourceMap: true`

**Usage example:**

```json
{
  "extends": "@chiastack/tsconfig/nestjs.json",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `compiled-package.json`

For internal packages that need to generate type declarations. Extends `base.json` and additionally includes:

- **Declaration generation**: `declaration: true` and `declarationMap: true`
- **Declaration only**: `emitDeclarationOnly: true`
- **Output directory**: `outDir: "${configDir}/dist"`

**Usage example:**

```json
{
  "extends": "@chiastack/tsconfig/compiled-package.json",
  "include": ["src"],
  "exclude": ["dist", "build", "node_modules"]
}
```

## Configuration Features

### Strictness

All configurations enable TypeScript's strict mode, including:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `checkJs: true` (in base.json)

### Performance Optimizations

- **Incremental compilation**: Enables `incremental: true` to speed up compilation
- **Project reference optimization**: `disableSourceOfProjectReferenceRedirect: true`
- **Skip lib check**: `skipLibCheck: true` to improve compilation performance

### Modern Settings

- **ES2022 target**: Uses the latest JavaScript features
- **Bundler module resolution**: Compatible with modern bundlers (Vite, Webpack, Turbopack, etc.)
- **Force module detection**: `moduleDetection: "force"`

## Excluded Directories

The following directories are excluded by default:

- `node_modules`
- `build`
- `dist`
- `.next`
- `.expo`
- `.output`

## Version

Current version: `0.0.1-beta.3`

## License

Uses the same license as the Chiastack monorepo.
