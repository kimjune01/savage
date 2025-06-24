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

The application consists of three main services:

### Frontend (React + TypeScript + Vite)

- **Port**: 5173
- **Tech Stack**: React 19, TypeScript, Tailwind CSS, Vite
- **Features**: Component-based UI, routing, state management

### API Server (Node.js + Express)

- **Port**: 8000
- **Tech Stack**: Express, TypeScript, OpenAI API integration
- **Features**: SVG generation, icon set creation, file upload handling

### Backend (Python + FastAPI)

- **Port**: 8001
- **Tech Stack**: FastAPI, Python 3.12+, SVG processing libraries
- **Features**: SVG analysis, optimization, validation, format conversion

## Development

### Prerequisites

- Node.js 20+
- Python 3.12+
- pnpm (package manager)
- uv (Python package manager)

### Quick Start

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd savage
   make setup
   ```

2. **Configure environment variables**:

   ```bash
   # Edit api/.env
   OPENAI_API_KEY=your_openai_api_key_here

   # Edit backend/.env (if needed)
   PORT=8001
   ```

3. **Start development servers**:

   ```bash
   make dev
   ```

   Or start services individually:

   ```bash
   make dev-frontend  # Port 5173
   make dev-api      # Port 8000
   make dev-backend  # Port 8001
   ```

### Available Commands

Run `make help` to see all available commands:

```bash
make install      # Install all dependencies
make dev         # Start all development servers
make build       # Build all services
make test        # Run all tests
make lint        # Run linting
make typecheck   # Run type checking
make clean       # Clean build artifacts
```

### Docker Development

```bash
make docker-dev    # Start with Docker Compose
make docker-down   # Stop Docker environment
make docker-logs   # View logs
```

## Testing

### Unit Tests

```bash
make test-frontend  # React component tests
make test-api      # API endpoint tests
make test-backend  # Python service tests
```

### End-to-End Tests

```bash
make test-e2e     # Playwright E2E tests
```

### Manual Testing

1. Start all services: `make dev`
2. Open http://localhost:5173
3. Test SVG generation with text prompts
4. Test icon set generation with reference images
5. Test SVG analysis and optimization features

## Project Structure

```
savage/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   └── services/          # API client services
├── api/                   # Node.js API server
│   └── src/              # TypeScript source code
├── backend/              # Python FastAPI backend
│   ├── services/         # Business logic services
│   └── utils/           # Utility functions
├── e2e/                 # End-to-end tests
└── .github/             # CI/CD workflows
```

## Deployment

### Production Build

```bash
make build        # Build all services
```

### Environment Variables

See `.env.example` files in each service directory for required configuration.

### Docker Production

```bash
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
