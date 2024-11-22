import { Client } from 'pg';
import { populateDatabase } from './databaseQueryController';

jest.mock('pg');

describe('populateDatabase Controller', () => {
  let mockReq, mockRes, mockClient, mockNext;

  beforeEach(() => {
    mockClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };

    Client.mockImplementation(() => mockClient);

    mockReq = {
      body: {
        postgreSqlUri: 'postgres://mock:mockpassword@localhost/postgres',
      },
    };
    mockRes = {
      locals: {
        databaseQuery: [
          `CREATE SCHEMA IF NOT EXISTS test_db;

        CREATE TABLE IF NOT EXISTS test_db.tests (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          year INT,
          genre VARCHAR(100),
          director VARCHAR(255)
        );

        INSERT INTO test_db.tests (title, year, genre, director)
        VALUES
          ('Test1', 2010, 'Sci-Fi', 'Christopher Nolan'),
          ('Test2', 1999, 'Action', 'The Wachowskis'),
          ('Test3', 2008, 'Action', 'Christopher Nolan')
        RETURNING *;`,
        ],
      },
    };
    mockNext = jest.fn();
  });
  afterEach(() => jest.clearAllMocks());

  it('should return 400 error if there is nothing in req.body.postreSqlUri', async () => {
    mockReq.body.postgreSqlUri = null;
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith({
      message: 'No database URI provided in the request body.',
      status: 400,
    });
  });

  it('should return 400 error if res.locals does not contain databaseQuery', async () => {
    mockRes.locals.databaseQuery = null;
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith({
      message: 'No query string available in the response locals',
      status: 400,
    });
  });

  it('should return 400 error if databaseQuery contains any forbiddenKeywords', async () => {
    mockRes.locals.databaseQuery = ['DROP TABLE test_table'];
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith({
      message: 'The generated SQL query contains forbidden keywords.',
      status: 400,
    });
  });
  it('should handle errors coming from the database query', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Database Error'));
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith({
      message: `Error occurred during database query: Database Error`,
      status: 500,
    });
  });
  it('should call connect, query, and end on the client', async () => {
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockClient.connect).toHaveBeenCalled;
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('CREATE SCHEMA IF NOT EXISTS test_db')
    );
    expect(mockClient.end).toHaveBeenCalled;
  });
  it('should call next with results when successful', async () => {
    mockClient.query
      .mockResolvedValueOnce()
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            title: 'Test1',
            year: 2010,
            genre: 'Sci-Fi',
            director: 'Christopher Nolan',
          },
        ],
      })
      .mockResolvedValueOnce();
    await populateDatabase(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRes.locals.results).toEqual({
      rows: [
        {
          id: 1,
          title: 'Test1',
          year: 2010,
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
        },
      ],
    });
  });
});
