import express from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-testing'
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// POST /verify-generation
const verifyGeneration = async (req: any, res: any, next: any) => {
  try {
    const imageFile = req.file;
    
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
        timestamp: new Date().toISOString()
      });
    }

    // Convert image buffer to base64 data URL
    const base64Image = imageFile.buffer.toString('base64');
    const dataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and describe what you see. Focus on colors, shapes, and style."
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const analysis = response.choices[0]?.message?.content;
    
    if (!analysis) {
      return res.status(500).json({
        success: false,
        error: 'No analysis content received',
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'API verification failed',
      timestamp: new Date().toISOString()
    });
  }
};

router.post('/verify-generation', upload.single('image'), verifyGeneration);

export { router as verifyRouter };