import request from 'supertest';
import { app } from '../server';

describe('API Server', () => {
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        timestamp: expect.any(String)
      });
    });
  });

  describe('Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not found'
      });
    });
  });
});