import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { generateSVG } from './services/openai';

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

// OpenAI-powered SVG generation endpoint
app.post('/api/generate/svg', upload.single('image'), async (req: Request, res: Response) => {
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

    // Convert image to base64 if provided
    let imageData: string | undefined;
    if (imageFile) {
      imageData = imageFile.buffer.toString('base64');
    }

    // Generate SVG using OpenAI
    const svg = await generateSVG(textPrompt || '', imageData);

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

app.post('/api/generate/icon-set', (req, res) => {
  const mockIcons = [
    {
      name: 'home',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
      success: true
    },
    {
      name: 'user', 
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      success: true
    }
  ];

  res.json({
    success: true,
    iconSet: mockIcons,
    metadata: {
      totalIcons: mockIcons.length,
      successfulIcons: mockIcons.length,
      failedIcons: 0,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});

export { app };