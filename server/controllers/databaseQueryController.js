import pg from 'pg';
const { Client } = pg;

export const populateDatabase = async (req, res, next) => {
  const pgUri = req.body.postgreSqlUri;
  if (!pgUri) {
    return next({
      message: 'No database URI provided in the request body.',
      status: 400,
    });
  }
  const client = new Client({
    connectionString: pgUri,
  });

  const { databaseQuery } = res.locals;
  // console.log('database query: ', databaseQuery[0])
  if (!databaseQuery) {
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
  ];
  // console.log(databaseQuery.length)
  const containsForbiddenKeyword = forbiddenKeywords.some((keyword) =>
    databaseQuery[0].toUpperCase().includes(keyword)
  );
  if (containsForbiddenKeyword) {
    return next({
      message: 'The generated SQL query contains forbidden keywords.', //could we mark which?
      status: 400,
    });
  }

  // console.log('Running query:', databaseQuery);
  try {
    await client.connect();
    await client.query('BEGIN');
    const results = await client.query(databaseQuery[0]);
    await client.query('COMMIT');
    res.locals.results = results;
    // console.log(`Upload result: ${JSON.stringify(results,null,2)}`);
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
