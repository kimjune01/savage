import request from 'supertest';
import express from 'express';
import { verifyRouter } from '../verify';

// Mock OpenAI
jest.mock('openai');

const mockCreate = jest.fn();
const mockOpenAI = {
  chat: {
    completions: {
      create: mockCreate
    }
  }
};

jest.mocked(require('openai').OpenAI).mockImplementation(() => mockOpenAI);

const app = express();
app.use(express.json());
app.use('/api', verifyRouter);

describe('POST /api/verify-generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return successful analysis when OpenAI responds correctly', async () => {
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: 'I can see a person in the image with dark hair and a friendly expression.'
        }
      }]
    });

    // Create a simple test image buffer
    const testImageBuffer = Buffer.from('fake-image-data');

    const response = await request(app)
      .post('/api/verify-generation')
      .attach('image', testImageBuffer, 'test.png')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.analysis).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
  });

  it('should handle OpenAI API errors gracefully', async () => {
    mockCreate.mockRejectedValue(new Error('OpenAI API Error'));

    const testImageBuffer = Buffer.from('fake-image-data');

    const response = await request(app)
      .post('/api/verify-generation')
      .attach('image', testImageBuffer, 'test.png')
      .expect(500);

    expect(response.body).toEqual({
      success: false,
      error: 'API verification failed',
      timestamp: expect.any(String)
    });
  });

  it('should handle missing OpenAI response content', async () => {
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: null
        }
      }]
    });

    const testImageBuffer = Buffer.from('fake-image-data');

    const response = await request(app)
      .post('/api/verify-generation')
      .attach('image', testImageBuffer, 'test.png')
      .expect(500);

    expect(response.body).toEqual({
      success: false,
      error: 'No analysis content received',
      timestamp: expect.any(String)
    });
  });

  it('should include timestamp in response', async () => {
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: 'Test analysis'
        }
      }]
    });

    const testImageBuffer = Buffer.from('fake-image-data');
    const beforeRequest = new Date().toISOString();
    
    const response = await request(app)
      .post('/api/verify-generation')
      .attach('image', testImageBuffer, 'test.png')
      .expect(200);
    const afterRequest = new Date().toISOString();

    expect(response.body.timestamp).toBeDefined();
    expect(response.body.timestamp >= beforeRequest).toBe(true);
    expect(response.body.timestamp <= afterRequest).toBe(true);
  });

  it('should return error when no image is provided', async () => {
    const response = await request(app)
      .post('/api/verify-generation')
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      error: 'No image file provided',
      timestamp: expect.any(String)
    });
  });
});