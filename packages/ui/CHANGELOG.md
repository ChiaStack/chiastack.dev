# @chiastack/ui

## 1.2.1

### Patch Changes

- [#110](https://github.com/ChiaStack/chiastack.dev/pull/110) [`793d8c5`](https://github.com/ChiaStack/chiastack.dev/commit/793d8c587a128f6232737fa0dbee78d36fad9d19) Thanks [@Chia1104](https://github.com/Chia1104)! - - introduce new oxlint package ([f00b3a6](https://github.com/Chia1104/chiastack.dev/commit/f00b3a6))
  - format code ([1517cd5](https://github.com/Chia1104/chiastack.dev/commit/1517cd5))

## 1.2.0

### Minor Changes

- [#107](https://github.com/ChiaStack/chiastack.dev/pull/107) [`60c2b20`](https://github.com/ChiaStack/chiastack.dev/commit/60c2b20d983143031c18c5e29424837f247b5e27) Thanks [@Chia1104](https://github.com/Chia1104)! - Code base cleanup

  ### ✨ Features
  - **ui**: add view transition support to image ([e29b3ab](https://github.com/Chia1104/chiastack.dev/commit/e29b3ab))

  ### 🐛 Bug Fixes
  - **features**: remove unused devtools ([2fc45df](https://github.com/Chia1104/chiastack.dev/commit/2fc45df))
  - **oxlint**: remove build script ([d8c95d3](https://github.com/Chia1104/chiastack.dev/commit/d8c95d3))

  ### 📝 Documentation
  - update docs ([598ee07](https://github.com/Chia1104/chiastack.dev/commit/598ee07))

  ### ♻️ Code Refactoring
  - function cleanup ([3543212](https://github.com/Chia1104/chiastack.dev/commit/3543212))

  ### 🔧 Chore
  - fix some lint issues ([1879150](https://github.com/Chia1104/chiastack.dev/commit/1879150))
  - switch eslint to oxlint ([f478030](https://github.com/Chia1104/chiastack.dev/commit/f478030))
  - ignore format code ([0dbfe7b](https://github.com/Chia1104/chiastack.dev/commit/0dbfe7b))
  - version release ([95f5428](https://github.com/Chia1104/chiastack.dev/commit/95f5428))
  - format code ([dc4f641](https://github.com/Chia1104/chiastack.dev/commit/dc4f641))
  - switch prettier to oxfmt ([9e9efa5](https://github.com/Chia1104/chiastack.dev/commit/9e9efa5))

## 1.1.2

### Patch Changes

- [#103](https://github.com/ChiaStack/chiastack.dev/pull/103) [`cfeec9a`](https://github.com/ChiaStack/chiastack.dev/commit/cfeec9a67158ec987322ec95725c71fcb4b0a5e1) Thanks [@Chia1104](https://github.com/Chia1104)! - update dependencies

## 1.1.1

### Patch Changes

- [#100](https://github.com/ChiaStack/chiastack.dev/pull/100) [`6d5a637`](https://github.com/ChiaStack/chiastack.dev/commit/6d5a637555d196ff5d44d9c450aec267cf73221a) Thanks [@Chia1104](https://github.com/Chia1104)! - setup repository info

## 1.1.0

### Minor Changes

- [#96](https://github.com/ChiaStack/chiastack.dev/pull/96) [`f6a98f4`](https://github.com/ChiaStack/chiastack.dev/commit/f6a98f485fe50d2dfead6665bac3efdc05c9bd0f) Thanks [@Chia1104](https://github.com/Chia1104)! - Added new Image component to UI package with React 19.2 minimum requirement, updated documentation, and bumped Next.js to 16.0.7 for security fixes.
  - **ui**: set react min version to 19.2 ([34e828a](https://github.com/Chia1104/chiastack.dev/commit/34e828a))
  - **ui**: add image component ([14c5420](https://github.com/Chia1104/chiastack.dev/commit/14c5420))
  - **docs**: update document ([bab9bc6](https://github.com/Chia1104/chiastack.dev/commit/bab9bc6))
  - **ui**: image docs ([725e22b](https://github.com/Chia1104/chiastack.dev/commit/725e22b))
  - update ui docs ([437b277](https://github.com/Chia1104/chiastack.dev/commit/437b277))
  - **deps**: bump next from 16.0.3 to 16.0.7 (#90) ([34b1d88](https://github.com/Chia1104/chiastack.dev/commit/34b1d88))
  - **deps**: bump next from 16.0.3 to 16.0.7 ([5d6608f](https://github.com/Chia1104/chiastack.dev/commit/5d6608f))

## 1.0.0

### Major Changes

- f48aaab: ## ✨ Features
  - **changelog-gen**: changelog generator (#87) ([6e4df88])
  - **changelog-gen**: changelog generator ([332339d])
  - **features**: init features package ([1cda963])
  - **ui**: introduce new trading-chart package ([e62981d])

  ## 🐛 Bug Fixes
  - **vite-area**: fix some lint issues ([22c14b8])
  - **features**: maybe bundle zustand... ([af6b593])
  - fix some type issues ([643891e])
  - **changelog-gen**: sort by priority ([bf86ab2])
  - **next-area**: fix some lint issues ([012fdca])
  - **next-area**: set default captcha env ([f1923d0])
  - **next-area**: set node env to test ([d102f35])
  - **features**: use 'useContext' pattern ([17b957e])
  - fix 'setup-node-witg-pnpm' typo ([a1704b9])
  - **ci**: update actions ([26a609a])

  ## 📝 Documentation
  - update features docs ([1d2ca4e])
  - update actions usage ([8c1e7ff])
  - update zh docs (#83) ([c09bf27])
  - hidden leva controller ([00fcf12])

  ## ♻️ Code Refactoring
  - **actions**: rename setup yml (#84) ([b5fd8ef])
  - **actions**: rename setup yml ([a6f61fe])

  ## ✅ Tests
  - testing ui & features usage ([762eead])
  - **next-area**: test captcha service ([27523b1])

  ## 📦 Build System
  - update changeset ([d5a8c89])
  - remove unused workspace ([5fe31d9])

  ## 👷 CI/CD
  - ignore changelog-gen ([ec2b2ba])
  - update vitest usage ([d0be9c0])
  - update changelog formatter ([14384a9])

  ## 🔧 Chore
  - **release**: update changeset ([c748c2b])
