/*
need to test:
- api key
    - if not defined, should throw error
- queryOpenai
    - should return error if naturalLanguageQuery is undefined
    - should throw an error if the OpenAI API returns an error
*/

import OpenAI from 'openai';

jest.mock('openai', () => {
  const mOpenAI = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  };
  return jest.fn(() => mOpenAI);
    // const mockCreate = jest.fn();
    // return jest.fn(() => ({
    // chat: {
    //     completions: {
    //     create: mockCreate,
    //     },
    // },
    // }));
});

describe('openaiController', () => {
  let mockCreate;
  beforeEach(() => {
    jest.resetModules(); // resets the module so it no longer uses cached variables (like cached environment variables)
    const mockOpenai = new OpenAI({ apiKey: 'mock-api-key' });
    mockCreate = mockOpenai.chat.completions.create;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('api key', () => {
    it('should throw error if api key is not defined', async () => {
      delete process.env.OPENAI_API_KEY;

      await expect(import('./openaiController')).rejects.toThrow(
        'The OPENAI_API_KEY environment variable is missing or empty.'
      );
    });
  });

  describe('queryOpenai', () => {
    beforeEach(() => {
      jest.resetModules();
      process.env.OPENAI_API_KEY = 'mock-api-key';
    });

    it('should return error if naturalLanguageQuery is undefined', async () => {
      const { queryOpenai } = await import('./openaiController'); // dynamically imports the module to avoid using the cached process.env variables and ensure we use the mock process.env variables we set above

      const req = { body: {} };
      const res = { locals: {} };
      const next = jest.fn();

      await queryOpenai(req, res, next);

      expect(next).toHaveBeenCalledWith({
        log: 'OpenAI query middleware did not receive a query',
        status: 500,
        message: { err: 'An error occured before querying OpenAI' },
      });
    });

    it('should return an error if openai api returns an error', async () => {
      // Mock the create method to reject with an error
      //   const mockOpenai = require('openai').default.mock.instances[0].chat.completions.create;
    //   const mockCreateReturn = jest.mockRejectedValue(new Error('OpenAI API error'));
    //   console.log('mockRejectedValue: ', await mockCreateReturn());

      await mockCreate.mockRejectedValue(new Error('OpenAI API error'));

      const { queryOpenai } = await import('./openaiController');

      const req = { body: {} };
      const res = { locals: { naturalLanguageQuery: 'test query' } };
      const next = jest.fn();

      await queryOpenai(req, res, next);
      console.log('calls: ', mockCreate.mock.calls);

    //   expect(mockCreate).toHaveBeenCalledWith({
    //     model: 'gpt-4o',
    //     temperature: 1,
    //     n: 1,
    //     messages: [
    //         { role: 'system', content: expect.any(String) }, // Matches the 'prompt' value
    //         { role: 'user', content: 'test query' },
    //       ],
    //   })

      expect(next).toHaveBeenCalledWith({
        log: 'openaiController.queryOpenAi: Error: OpenAI API error',
        status: 500,
        message: {
          err: 'A server error occured while querying OpenAI',
        },
      });
    });
  });
});
