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

Once a project is initialized, update this file with:
- Build, test, and lint commands
- Project architecture overview
- Development workflow specifics