import { Client } from 'pg';

export const populateDatabase = async (req, res, next) => {
  const pgUri = req.body.postgreSqlUri;
  if (!pgUri) {
    return next({
      message: 'No database URI provided in the request body',
      status: 400,
    });
  }
  const client = new Client({
    connectionString: pgUri,
  });

  const { aiQueryString } = res.locals;
  if (!aiQueryString) {
    return next({
      message: 'No query string available in the response locals',
      status: 400,
    });
  }
  //Safety check to make sure the AI generated query doesn't have dangerous SQL query keywords
  const forbiddenKeywords = [
    'DROP',
    'DELETE',
    'TRUNCATE',
    'ALTER',
    '--',
    '/*',
    '*/',
    ';',
  ];
  const containsForbiddenKeyword = forbiddenKeywords.some((keyword) =>
    aiQueryString.toUpperCase().includes(keyword)
  );
  if (containsForbiddenKeyword) {
    return next({
      message: 'The generated SQL query contains forbidden keywords.',
      status: 400,
    });
  }

  console.log('Running query:', aiQueryString);
  try {
    await client.connect();
    await client.query('BEGIN');
    const results = await client.query(aiQueryString);
    await client.query('COMMIT');
    res.locals.results = results;

    return next();
  } catch (error) {
    await client.query('ROLLBACK');
    return next({
      message: `Error occurred during database query: ${error.message}`,
      status: 500,
    });
  } finally {
    await client.end();
  }
};
