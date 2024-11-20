import OpenAI from 'openai';
import prompt from '../prompt.js';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    'The OPENAI_API_KEY environment variable is missing or empty.'
  );
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export const queryOpenai = async (req, res, next) => {
  console.log('Querying OpenAI!');
  const { naturalLanguageQuery } = res.locals;
  if (!naturalLanguageQuery) {
    const error = {
      log: 'OpenAI query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occured before querying OpenAI' },
    };
    return next(error);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 1,
      n: 5,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: naturalLanguageQuery },
      ],
    });

    if (completion.choices.length === 0) {
      const error = {
        log: 'OpenAI did not recieve a completion',
        status: 500,
        message: { err: 'An error occured while querying OpenAI' },
      };
      return next(error);
    }
    //res.locals.aiQueryString = completion.choices[0].message.content
    console.log(completion.choices[0].message.content);
    console.log('Exiting queryOpenai');
    return next();
  } catch (error) {
    return next({
      log: 'openaiController.queryOpenAi: ' + error,
      status: 500,
      message: {
        err: 'A server error occured while querying OpenAI',
      },
    });
  }
};
