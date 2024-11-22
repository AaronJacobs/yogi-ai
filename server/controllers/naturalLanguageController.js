export const parseNaturalLanguageQuery = async (req, res, next) => {
  if (req.body === undefined) {
    const error = {
      log: 'parseNaturalLanguageQuery: Request body is undefined',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  if (req.body === null) {
    const error = {
      log: 'parseNaturalLanguageQuery: Request body is null',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  if (!req.body.naturalLanguageQuery && req.body.naturalLanguageQuery !== '') {
    const error = {
      log: 'parseNaturalLanguageQuery: Natural Language Query not provided',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  const { naturalLanguageQuery } = req.body;
  if (typeof naturalLanguageQuery !== 'string') {
    const error = {
      log: 'parseNaturalLanguageQuery: Natural Language Query is not a string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  if (naturalLanguageQuery.length === 0) {
    const error = {
      log: 'parseNaturalLanguageQuery: Natural Language Query is an empty string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }
  res.locals.naturalLanguageQuery = naturalLanguageQuery;
  return next();
};
