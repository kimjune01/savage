import express from 'express';
import multer from 'multer';
import { generateSVG, generateIconSet } from '../services/openai';
import { validateGenerationRequest, validateIconSetRequest } from '../utils/validation';
import { processImage } from '../utils/imageProcessing';
import { logger } from '../server';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
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

// Single SVG generation
router.post('/svg', upload.single('image'), async (req, res, next) => {
  try {
    const { textPrompt } = req.body;
    const imageFile = req.file;

    // Validate request
    const validation = validateGenerationRequest(textPrompt, imageFile);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    let processedImage = null;
    if (imageFile) {
      processedImage = await processImage(imageFile.buffer);
    }

    const svgContent = await generateSVG(textPrompt, processedImage);
    
    res.json({
      success: true,
      svg: svgContent,
      metadata: {
        hasTextPrompt: !!textPrompt,
        hasImage: !!imageFile,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('SVG generation error:', error);
    next(error);
  }
});

// Icon set generation
router.post('/icon-set', upload.single('referenceIcon'), async (req, res, next) => {
  try {
    const { stylePrompt, iconConcepts, iconSize, strokeWidth, colorPalette } = req.body;
    const referenceIcon = req.file;

    // Parse icon concepts (expecting JSON string)
    let parsedConcepts;
    try {
      parsedConcepts = JSON.parse(iconConcepts);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid icon concepts format' });
    }

    // Validate request
    const validation = validateIconSetRequest(stylePrompt, parsedConcepts, referenceIcon);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    let processedReference = null;
    if (referenceIcon) {
      processedReference = await processImage(referenceIcon.buffer);
    }

    const iconSet = await generateIconSet({
      stylePrompt,
      iconConcepts: parsedConcepts,
      referenceIcon: processedReference,
      iconSize: iconSize || '24x24',
      strokeWidth: strokeWidth || '2px',
      colorPalette: colorPalette || 'monochrome'
    });

    res.json({
      success: true,
      iconSet,
      metadata: {
        totalIcons: parsedConcepts.length,
        successfulIcons: iconSet.filter(icon => icon.success).length,
        failedIcons: iconSet.filter(icon => !icon.success).length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Icon set generation error:', error);
    next(error);
  }
});

// Add single icon to existing set
router.post('/icon-set/add', upload.single('referenceIcon'), async (req, res, next) => {
  try {
    const { stylePrompt, iconConcept, iconSize, strokeWidth, colorPalette } = req.body;
    const referenceIcon = req.file;

    if (!iconConcept) {
      return res.status(400).json({ error: 'Icon concept is required' });
    }

    let processedReference = null;
    if (referenceIcon) {
      processedReference = await processImage(referenceIcon.buffer);
    }

    const iconSet = await generateIconSet({
      stylePrompt,
      iconConcepts: [{ name: iconConcept.name, description: iconConcept.description }],
      referenceIcon: processedReference,
      iconSize: iconSize || '24x24',
      strokeWidth: strokeWidth || '2px',
      colorPalette: colorPalette || 'monochrome'
    });

    const newIcon = iconSet[0];
    
    res.json({
      success: true,
      icon: newIcon,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Single icon generation error:', error);
    next(error);
  }
});

export { router as generateRoutes };