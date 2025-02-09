import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { queryOpenai } from './controllers/openaiController.js';
import { parseNaturalLanguageQuery } from './controllers/naturalLanguageController.js';
import { populateDatabase } from './controllers/databaseQueryController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api/query',
  (req, res, next) => {
    // console.log('Found Endpoint!');
    return next();
  },
  parseNaturalLanguageQuery,
  queryOpenai,
  populateDatabase,
  (_req, res, _next) => {
    res.status(200).json(res.locals.databaseQuery);
  }
);

app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  // console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

export default app;
