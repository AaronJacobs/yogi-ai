import request from 'supertest';
import { app, PORT, startServer } from './server.js';

let server;

beforeAll(() => {
  console.log = jest.fn();
  server = startServer();
});

afterAll(() => {
  server.close();
});

describe('Server', () => {
  it('should respond to get query to /test endpoint with "Server is running"', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200); // Check for a successful response
    expect(response.text).toBe('Server is running'); // Ensure the correct text is returned
  });

  it('should respond with the correct message when the server starts', async () => {
    await request(app).get('/test');
    expect(console.log).toHaveBeenCalledWith('Server listening on port: 3000'); // Ensure the correct text is returned
  });
  it('should use a port number of 3000', async () => {
    expect(PORT).toBe(3000);
  });
});
