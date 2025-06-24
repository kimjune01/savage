# Savage

AI-Powered SVG Generation Platform

## Features

Based on the feature specifications in `features.md`, this application provides:

### Core Features

- **AI-Powered SVG Generation**: Create scalable vector graphics using text prompts and/or reference images
- **Icon Set Generation**: Generate cohesive icon sets with consistent styling from a reference icon
- **File Upload Interface**: Drag-and-drop and click-to-browse file upload with image preview
- **SVG Preview and Interaction**: Real-time preview with zoom controls and code view toggle
- **Export Functionality**: Download SVG files and export to PNG, JPEG with customizable options
- **SVG Analysis**: Analyze SVG complexity, file size, and get optimization suggestions
- **SVG Optimization**: Optimize SVG files for better performance and smaller file sizes
- **SVG Validation**: Validate SVG content and check for common issues

### Technical Features

- **Responsive Design**: Mobile-friendly interface that works across devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: Keyboard navigation and screen reader support
- **Dark Mode**: Toggle between light and dark themes

## Architecture

The application consists of two main services:

### Frontend (React + TypeScript + Vite)

- **Directory**: `/frontend`
- **Port**: 5173 (or 5174 if 5173 is busy)
- **Tech Stack**: React 19, TypeScript, Tailwind CSS, Vite
- **Features**: Component-based UI, routing, state management
- **Start Command**: `cd frontend && pnpm dev`

### Backend (Node.js + Express API)

- **Directory**: `/backend`
- **Port**: 8000
- **Tech Stack**: Express, TypeScript, mock API endpoints
- **Features**: SVG generation API, icon set creation, file upload handling
- **Start Command**: `cd backend && pnpm dev`

## Development

### Prerequisites

- Node.js 20+
- pnpm (package manager)

### Quick Start

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd savage
   pnpm install:all
   ```

2. **Start development servers**:

   **Option A: All services at once (recommended)**

   ```bash
   pnpm dev
   ```

   **Option B: Individual services**

   In separate terminal windows:

   ```bash
   # Terminal 1: Frontend (React + Vite)
   cd frontend && pnpm dev
   # Serves on http://localhost:5173 (or 5174 if 5173 is busy)

   # Terminal 2: Backend API (Node.js + Express)
   cd backend && pnpm dev
   # Serves on http://localhost:8000
   ```

3. **Open the application**:

   ```bash
   # Automatically open in browser
   open http://localhost:5173

   # Or manually navigate to:
   # - Frontend: http://localhost:5173
   # - Backend API Health: http://localhost:8000/health
   ```

### Available Commands

Run `make help` to see all available commands:

```bash
pnpm install:all      # Install all dependencies
pnpm dev             # Start all development servers
pnpm build           # Build all services
pnpm test            # Run all tests
pnpm lint            # Run linting
pnpm typecheck       # Run type checking
pnpm clean           # Clean build artifacts
```

### Docker Development

Docker configuration is planned for future releases.

## Testing

### Unit Tests

```bash
pnpm test:frontend  # React component tests (Vitest)
pnpm test:backend   # Backend API tests (Jest)
pnpm test          # Run all tests
```

### End-to-End Tests

```bash
pnpm test:e2e     # Playwright E2E tests
```

### Manual Testing

1. Start all services: `pnpm dev` or follow individual service instructions above
2. Open http://localhost:5173 (or the port shown in your terminal)
3. Test the application features:
   - **SVG Generation**: Enter text prompts, upload reference images
   - **Icon Set Generation**: Create cohesive icon sets with custom styling
   - **SVG Analysis**: Upload SVG files for analysis and optimization

### Troubleshooting

**Port conflicts**: If ports 5173, 8000, or 8001 are already in use, the servers will automatically try alternative ports. Check the terminal output for the actual URLs.

**API not responding**: If the API server has issues, the frontend will still work with mock data for development.

**Missing dependencies**: Run `pnpm install:all` in the root directory to install dependencies for all services.

## Project Structure

```
savage/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── services/     # API client services
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── package.json      # Backend dependencies
├── e2e/                  # End-to-end tests
├── package.json          # Root monorepo scripts
└── .github/              # CI/CD workflows
```

## Deployment

### Production Build

```bash
pnpm build        # Build all services
```

### Environment Variables

See `.env.example` files in each service directory for required configuration.

### Production Deployment

Production deployment configuration is planned for future releases.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
