export const parseNaturalLanguageQuery = async (req, res, next) => {
  console.log('Parsing the Natural Language Query!');
  console.log('req.body looks like this:', req.body);
  if (!req.body.naturalLanguageQuery) {
    const error = {
      log: 'Natural Language Query not provided',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  console.log('About to grab the naturalLanguageQuery from req.body');
  const { naturalLanguageQuery } = req.body;
  console.log(naturalLanguageQuery);
  if (typeof naturalLanguageQuery !== 'string') {
    const error = {
      log: 'Natural Language Query is not a string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }

  res.locals.naturalLanguageQuery = naturalLanguageQuery;
  return next();
};
