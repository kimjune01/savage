# AI-Powered SVG Generator Web Service

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: pnpm
- **State Management**: Zustand (for UI state and generation history)
- **AI Integration**: OpenAI API (GPT-4 Vision for multimodal prompts)
- **SVG Libraries**: 
  - **Sharp** - Server-side SVG to PNG/JPEG conversion
  - **SVGR** - Transform SVG components for React
- **Deployment**: Vercel

## Key Dependencies
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "^18",
    "openai": "^4.x",
    "sharp": "^0.33.0",
    "@svgr/webpack": "^8.1.0",
    "zustand": "^4.5.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "latest",
    "react-dropzone": "^14.x"
  }
}
```

## Project Structure
```
savage/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts     # Call OpenAI API and generate SVG
│   │   ├── export/
│   │   │   └── route.ts     # Export SVG to PNG/JPEG
│   │   └── history/
│   │       └── route.ts     # Get generation history
│   ├── generate/
│   │   └── page.tsx         # Main generation page
│   ├── history/
│   │   └── page.tsx         # Browse generation history
│   ├── page.tsx             # Landing page
│   └── layout.tsx
├── components/
│   ├── generator/
│   │   ├── ImageUpload.tsx  # Drag-drop image upload
│   │   ├── TextPrompt.tsx   # Text input with suggestions
│   │   ├── GenerateButton.tsx # Submit generation request
│   │   └── SVGPreview.tsx   # Display generated SVG
│   ├── export/
│   │   └── ExportOptions.tsx # Download/export controls
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── openai-client.ts     # OpenAI API wrapper
│   ├── svg-parser.ts        # Parse AI response to SVG
│   ├── export-utils.ts      # Sharp conversion utilities
│   └── stores/
│       └── app-store.ts     # Zustand store
└── public/
    └── examples/            # Example images/prompts
```

## Key Features

### 1. AI-Powered Generation
- **Multimodal Input**: Upload image + text prompt
- **GPT-4 Vision API**: Analyzes image and interprets text to generate SVG code
- **Smart Parsing**: Converts AI response into valid SVG
- **Style Understanding**: Recognizes artistic styles, colors, and composition from reference images

### 2. Input Methods
- **Image Upload**: Drag-and-drop or click to upload reference images
- **Text Prompts**: Natural language descriptions with autocomplete suggestions
- **Combined Mode**: Use both image and text for more precise results
- **Example Gallery**: Pre-made examples to get started quickly

### 3. Export Options
- **Download as SVG**: Clean, scalable vector format
- **PNG/JPEG Export**: Server-side conversion via Sharp
- **Copy SVG Code**: Direct clipboard copy for developers
- **Resolution Options**: Export at various sizes

### 4. Generation History
- **Save Generations**: Automatic saving with metadata
- **Browse History**: Gallery view with filters
- **Regenerate**: Re-run previous prompts with modifications
- **Share Links**: Shareable URLs for specific generations

### 5. Performance & UX
- **Streaming Response**: Show generation progress
- **Error Handling**: Graceful fallbacks for API failures
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Toggle between light/dark themes

## Implementation Steps
1. Initialize Next.js with TypeScript and Tailwind
2. Set up OpenAI API client with GPT-4 Vision
3. Create image upload component with react-dropzone
4. Build text prompt interface with suggestions
5. Implement API route for AI generation
6. Create SVG parser to handle AI responses
7. Add Sharp integration for export formats
8. Build generation history with Zustand
9. Deploy to Vercel with environment variables

## Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Vercel Deployment Config
```json
{
  "functions": {
    "app/api/generate/route.ts": {
      "maxDuration": 60
    },
    "app/api/export/route.ts": {
      "maxDuration": 30
    }
  }
}
```

## API Design

### Generate Endpoint
```typescript
POST /api/generate
{
  "prompt": "A minimalist mountain landscape",
  "imageBase64": "data:image/jpeg;base64,..." // optional
}

Response:
{
  "svg": "<svg>...</svg>",
  "id": "gen_123456",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Export Endpoint
```typescript
POST /api/export
{
  "svg": "<svg>...</svg>",
  "format": "png" | "jpeg",
  "width": 1920,
  "height": 1080
}

Response: Binary image data
```