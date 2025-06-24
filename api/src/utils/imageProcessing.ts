import sharp from 'sharp';
import { logger } from '../server';

export async function processImage(buffer: Buffer): Promise<string> {
  try {
    // Process the image: resize if too large, convert to PNG, optimize
    const processedBuffer = await sharp(buffer)
      .resize(1024, 1024, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .png({ 
        quality: 90,
        compressionLevel: 6 
      })
      .toBuffer();

    // Convert to base64
    const base64 = processedBuffer.toString('base64');
    
    logger.info(`Image processed: ${buffer.length} bytes -> ${processedBuffer.length} bytes`);
    
    return base64;
  } catch (error) {
    logger.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

export async function extractImageMetadata(buffer: Buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    logger.error('Metadata extraction error:', error);
    throw new Error('Failed to extract image metadata');
  }
}