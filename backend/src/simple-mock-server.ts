import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock SVG generation endpoint
app.post('/api/generate/svg', upload.single('image'), (req: Request, res: Response) => {
  try {
    const { textPrompt } = req.body;
    const imageFile = req.file;

    // Validate input
    if (!textPrompt && !imageFile) {
      res.status(400).json({
        success: false,
        error: 'Either textPrompt or image file is required'
      });
      return;
    }

    console.log('Generating SVG for prompt:', textPrompt);

    // Generate a simple mock SVG based on the prompt
    const mockSvgs: { [key: string]: string } = {
      'sun': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#ffeb3b" stroke="#ff9800" stroke-width="2"/><g stroke="#ff9800" stroke-width="3"><line x1="50" y1="10" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="90"/><line x1="10" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="90" y2="50"/><line x1="21.5" y1="21.5" x2="28.5" y2="28.5"/><line x1="71.5" y1="71.5" x2="78.5" y2="78.5"/><line x1="71.5" y1="28.5" x2="78.5" y2="21.5"/><line x1="21.5" y1="78.5" x2="28.5" y2="71.5"/></g></svg>',
      'star': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,15 61,35 85,35 67,50 73,75 50,60 27,75 33,50 15,35 39,35" fill="#ffd700" stroke="#ffb300" stroke-width="2"/></svg>',
      'heart': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,20 C47,21 50,25 50,25 C50,25 53,21 55,20 C70,15 80,25 80,40 C80,60 50,85 50,85 Z" fill="#e91e63" stroke="#c2185b" stroke-width="2"/></svg>',
      'tree': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="45" y="60" width="10" height="25" fill="#8d6e63"/><circle cx="50" cy="40" r="25" fill="#4caf50" stroke="#388e3c" stroke-width="2"/></svg>',
      'house': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,20 20,50 80,50" fill="#f44336" stroke="#d32f2f" stroke-width="2"/><rect x="30" y="50" width="40" height="30" fill="#ffeb3b" stroke="#fbc02d" stroke-width="2"/><rect x="40" y="60" width="8" height="12" fill="#8d6e63"/><rect x="52" y="60" width="8" height="8" fill="#2196f3"/></svg>',
      'cat': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="25" ry="20" fill="#ff9800"/><circle cx="40" cy="55" r="3" fill="#000"/><circle cx="60" cy="55" r="3" fill="#000"/><polygon points="35,40 45,50 40,50" fill="#ff9800"/><polygon points="65,40 55,50 60,50" fill="#ff9800"/><path d="M45,65 Q50,70 55,65" stroke="#000" stroke-width="2" fill="none"/></svg>',
      'dog': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="20" ry="15" fill="#8d6e63"/><ellipse cx="35" cy="40" rx="8" ry="12" fill="#8d6e63"/><ellipse cx="65" cy="40" rx="8" ry="12" fill="#8d6e63"/><circle cx="45" cy="50" r="2" fill="#000"/><circle cx="55" cy="50" r="2" fill="#000"/><ellipse cx="50" cy="60" rx="3" ry="2" fill="#000"/></svg>'
    };

    // Find a matching mock SVG or create a generic one
    const promptLower = textPrompt.toLowerCase();
    let svg = '';
    
    for (const [key, mockSvg] of Object.entries(mockSvgs)) {
      if (promptLower.includes(key)) {
        svg = mockSvg;
        break;
      }
    }

    // Generic circle SVG if no match found
    if (!svg) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#2196f3" stroke="#1976d2" stroke-width="3"/><text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="8">${textPrompt.substring(0, 10)}</text></svg>`;
    }

    // Simulate some processing time
    setTimeout(() => {
      res.json({
        success: true,
        svg: svg,
        metadata: {
          hasTextPrompt: !!textPrompt,
          hasImage: !!imageFile,
          imageSize: imageFile ? imageFile.size : 0,
          timestamp: new Date().toISOString()
        }
      });
    }, 1000); // 1 second delay to simulate processing

  } catch (error) {
    console.error('SVG generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate SVG',
      metadata: {
        hasTextPrompt: !!req.body.textPrompt,
        hasImage: !!req.file,
        imageSize: req.file ? req.file.size : 0,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/generate/svg');
});

export { app };