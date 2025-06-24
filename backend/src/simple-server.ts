import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock API endpoints for development
app.post('/api/generate/svg', (req, res) => {
  const mockSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="#3B82F6" stroke="#1E40AF" stroke-width="4"/>
    <text x="100" y="110" text-anchor="middle" fill="white" font-size="16">Demo SVG</text>
  </svg>`;
  
  res.json({
    success: true,
    svg: mockSVG,
    metadata: {
      hasTextPrompt: !!req.body.textPrompt,
      hasImage: !!req.body.image,
      timestamp: new Date().toISOString()
    }
  });
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
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export { app };