import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    'The OPENAI_API_KEY environment variable is missing or empty.'
  );
}

const openai = new OpenAI({
    apiKey: apiKey,
  });

export default openai;