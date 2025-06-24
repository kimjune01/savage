import { Request, Response, NextFunction } from 'express';
import { logger } from '../server';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size must be less than 20MB'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Invalid file upload',
      message: 'Unexpected file field'
    });
  }

  // Handle OpenAI API errors
  if (error.message.includes('OpenAI')) {
    return res.status(502).json({
      error: 'Service unavailable',
      message: 'AI service is temporarily unavailable. Please try again later.'
    });
  }

  // Handle rate limiting errors
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    });
  }

  // Handle validation errors
  if (error.message.includes('validation')) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.message
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(statusCode).json({
    error: 'Server error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
}