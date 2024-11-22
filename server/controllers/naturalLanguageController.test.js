import { parseNaturalLanguageQuery } from './naturalLanguageController';

describe('parseNaturalLanguageQuery', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      locals: {},
    };
    next = jest.fn();
  });
  it('should call next with an error if naturalLanguageQuery is not provided', async () => {
    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: 'parseNaturalLanguageQuery: Natural Language Query not provided',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    });
  });
  it('should call next with an error if request body is undefined', async () => {
    req.body = undefined
    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: 'parseNaturalLanguageQuery: Request body is undefined',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    });
  });
  it('should call next with an error if request body is null', async () => {
    req.body = null
    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: 'parseNaturalLanguageQuery: Request body is null',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    });
  });
  it('should call next with an error if naturalLanguageQuery is not a string', async () => {
    req.body.naturalLanguageQuery = 123;

    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: 'parseNaturalLanguageQuery: Natural Language Query is not a string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    });
  });
  it('should call next with an error if naturalLanguageQuery is an empty string', async () => {
    req.body.naturalLanguageQuery = '';

    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith({
      log: 'parseNaturalLanguageQuery: Natural Language Query is an empty string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    });
  });
  it('should work for very long strings', async () => {
    req.body.naturalLanguageQuery = 'abcde'.repeat(1000);

    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
  it('should set res.locals.naturalLanguageQuery to the value of req.body.naturalLanguageQuery', async () => {
    req.body.naturalLanguageQuery = `Bob's yer uncle`;

    await parseNaturalLanguageQuery(req, res, next);

    expect(res.locals.naturalLanguageQuery).toBe(`Bob's yer uncle`);
  });
  it('should call next with no parameters when req.body.naturalLanguageQuery contains a string with a length over 0', async () => {
    req.body.naturalLanguageQuery = `Bob's yer uncle`;

    await parseNaturalLanguageQuery(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
