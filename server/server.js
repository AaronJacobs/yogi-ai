import express from 'express';

const app = express();
const PORT = 3000;

// Route definition
app.get('/test', (_req, res) => {
  res.status(200).send('Server is running');
});

export const startServer = () => {
  return app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
};

// Export the app for testing purposes
export { app, PORT };
