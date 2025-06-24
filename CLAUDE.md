# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This directory is currently empty and has no initialized project. When starting a new project here, follow these preferences:

- **Python projects**: Use `uv` for project setup and dependency management
- **React/TypeScript projects**: Use Vite with `pnpm` as the package manager
- **Version Control**: Initialize git repository with `git init`

## Getting Started

To initialize a new project in this directory:

### For Python projects:

```bash
uv init
```

### For React/TypeScript projects:

```bash
pnpm create vite . --template react-ts
```

### For other project types:

Use the appropriate initialization command for the chosen framework or language.

## Development Commands

### Build and Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm typecheck    # Run TypeScript type checking
```

### Git Hooks

Pre-commit hooks automatically run:

- ESLint with auto-fix on staged JS/TS files
- TypeScript type checking
- Prettier formatting on JSON/MD files

To skip hooks (not recommended): `git commit --no-verify`
