// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-api-key';

// Mock external services
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>'
            }
          }]
        })
      }
    }
  }))
}));