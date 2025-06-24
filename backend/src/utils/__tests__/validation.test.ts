import { validateGenerationRequest, validateIconSetRequest } from '../validation';

describe('Validation Utils', () => {
  describe('validateGenerationRequest', () => {
    it('should pass with valid text prompt', () => {
      const result = validateGenerationRequest('This is a valid prompt with more than 10 characters');
      expect(result.isValid).toBe(true);
    });

    it('should fail with short text prompt', () => {
      const result = validateGenerationRequest('short');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter at least 10 characters');
    });

    it('should fail with no text prompt and no image', () => {
      const result = validateGenerationRequest();
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Either text prompt or image is required');
    });

    it('should pass with valid image file', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024 // 1MB
      } as Express.Multer.File;

      const result = validateGenerationRequest(undefined, mockFile);
      expect(result.isValid).toBe(true);
    });

    it('should fail with invalid image type', () => {
      const mockFile = {
        mimetype: 'image/gif',
        size: 1024 * 1024
      } as Express.Multer.File;

      const result = validateGenerationRequest(undefined, mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please upload a JPEG, PNG, or WebP image');
    });

    it('should fail with oversized image', () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 25 * 1024 * 1024 // 25MB
      } as Express.Multer.File;

      const result = validateGenerationRequest(undefined, mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size must be less than 20MB');
    });
  });

  describe('validateIconSetRequest', () => {
    const validConcepts = [
      { name: 'home', description: 'House icon' },
      { name: 'user', description: 'Person icon' }
    ];

    it('should pass with valid inputs', () => {
      const result = validateIconSetRequest('Minimalist style', validConcepts);
      expect(result.isValid).toBe(true);
    });

    it('should fail with short style prompt', () => {
      const result = validateIconSetRequest('sho', validConcepts);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Style prompt must be at least 5 characters');
    });

    it('should fail with no icon concepts', () => {
      const result = validateIconSetRequest('Valid style prompt', []);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('At least one icon concept is required');
    });

    it('should fail with too many icon concepts', () => {
      const manyConcepts = Array(25).fill({ name: 'icon', description: 'desc' });
      const result = validateIconSetRequest('Valid style prompt', manyConcepts);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Maximum 20 icons can be generated at once');
    });

    it('should fail with invalid concept structure', () => {
      const invalidConcepts = [{ name: 'home' }]; // missing description
      const result = validateIconSetRequest('Valid style prompt', invalidConcepts as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Each icon concept must have a name and description');
    });
  });
});