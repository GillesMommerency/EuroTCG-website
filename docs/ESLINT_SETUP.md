# ESLint and Code Quality Setup - EuroTCG Website

## 🎯 Overview

This document explains the ESLint configuration and automated code quality tools
set up for the EuroTCG website to ensure consistent code quality and catch
errors early in development.

## ⚙️ Configuration

### ESLint Configuration

The project uses ESLint with the following setup:

- **TypeScript support** via `@typescript-eslint/eslint-plugin`
- **React/JSX support** via `eslint-plugin-react` and
  `eslint-plugin-react-hooks`
- **Astro support** via `eslint-plugin-astro`
- **Accessibility checks** via `eslint-plugin-jsx-a11y`
- **Prettier integration** via `eslint-config-prettier`

### VS Code Integration

ESLint is configured to run automatically in VS Code:

- **Auto-fix on save** for all supported file types
- **Real-time error highlighting** in the editor
- **Format on save** with Prettier integration
- **Import organization** on save

## 🚀 Available Commands

### Linting Commands

```bash
# Run ESLint on all files
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Run ESLint for CI (with max warnings limit)
npm run lint:ci

# Watch mode - run ESLint when files change
npm run lint:watch

# Run lint-staged (used by Husky pre-commit hook)
npm run lint:staged
```

### Other Quality Commands

```bash
# Format all files with Prettier
npm run format

# Check Prettier formatting
npm run format:check

# TypeScript type checking
npm run type-check

# Build (includes linting)
npm run build
```

## 🔧 VS Code Tasks

The following tasks are available in VS Code (Ctrl+Shift+P → "Tasks: Run Task"):

1. **ESLint: Lint All Files** - Run ESLint on entire codebase
2. **ESLint: Fix All Issues** - Auto-fix all fixable ESLint issues
3. **Lint & Format Current File** - Lint and fix the currently open file
4. **Prettier: Format All Files** - Format all files
5. **TypeScript: Check Types** - Run TypeScript compiler

## 🪝 Git Hooks (Husky + lint-staged)

### Pre-commit Hook

Automatically runs when you commit code:

- **JavaScript/TypeScript files**: ESLint auto-fix + Prettier formatting
- **Astro files**: ESLint auto-fix + Prettier formatting
- **JSON/Markdown/CSS files**: Prettier formatting
- **Images**: Optimization (if imagemin-lint-staged is installed)

### Configuration (package.json)

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{astro}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml,css,scss}": ["prettier --write"]
  }
}
```

## 📋 VS Code Extensions

### Required Extensions

- **ESLint** (`dbaeumer.vscode-eslint`) - ESLint integration
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Astro** (`astro-build.astro-vscode`) - Astro language support

### Recommended Extensions

- **Error Lens** (`usernamehw.errorlens`) - Inline error display
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Tailwind support
- **Code Spell Checker** (`streetsidesoftware.code-spell-checker`) - Spell
  checking
- **Path Intellisense** (`christian-kohler.path-intellisense`) - Path
  autocompletion

## 🎯 Workflow

### Development Workflow

1. **Write code** - ESLint highlights issues in real-time
2. **Save file** - Auto-fix and format applied automatically
3. **Commit code** - Pre-commit hook runs lint-staged
4. **Build project** - Full linting check runs before build

### Manual Quality Checks

```bash
# Quick check before committing
npm run lint:fix && npm run type-check

# Full quality check
npm run lint:ci && npm run format:check && npm run type-check

# Fix all formatting issues
npm run format && npm run lint:fix
```

## 🛠️ Troubleshooting

### Common Issues

**ESLint not running on save:**

1. Check VS Code ESLint extension is installed and enabled
2. Verify `.vscode/settings.json` has correct configuration
3. Restart VS Code ESLint server: Ctrl+Shift+P → "ESLint: Restart ESLint Server"

**Pre-commit hook not working:**

```bash
# Reinstall husky hooks
npm run prepare
```

**Build failing due to lint errors:**

- Run `npm run lint:fix` to auto-fix issues
- Check remaining errors with `npm run lint`
- Fix remaining issues manually

### ESLint Error Levels

- 🔴 **Error**: Must be fixed (breaks build)
- 🟡 **Warning**: Should be fixed (build continues)
- ℹ️ **Info**: Optional improvements

## 📊 Build Integration

The build process now includes linting:

```bash
# Build command now runs:
npm run lint:ci    # Check for errors/warnings
astro check        # TypeScript checking
astro build        # Actual build
```

This ensures no code with linting errors reaches production!

## 🎉 Benefits

✅ **Consistent code style** across the team ✅ **Early error detection** during
development ✅ **Automated code formatting** on save ✅ **Pre-commit
validation** prevents bad code ✅ **Build safety** - no broken code in
production ✅ **VS Code integration** with real-time feedback ✅ **Zero
configuration** for new developers

The setup ensures high code quality with minimal developer friction! 🚀
