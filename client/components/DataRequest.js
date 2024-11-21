import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { errorMonitor } from 'events';

const DataRequest = () => {
  const [postgreSqlUri, setPostgreSqlUri] = useState(''); // uri for postgreSql db to be input by user
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState(''); // query text to be input by user
  const [loading, setLoading] = useState(false); // boolean that will be set to true when the request is being made
  const [error, setError] = useState(''); // error message to be displayed if request fails
  const [serverResponse, setServerResponse] = useState(''); // response from server to be displayed to user

  const handleSubmit = async () => {
    // should also check if postgres uri and request text are not empty
    setLoading(true);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postgreSqlUri, naturalLanguageQuery }),
      });
      const responseData = await response.json();
      setServerResponse(responseData);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography
        variant='h1'
        sx={{
          color: 'rgb(10, 10,10)',
          marginTop: 3,
          marginBottom: 2,
          fontSize: 30,
        }}
      >
        Data Request Component wooooo
      </Typography>
      <TextField
        fullWidth
        multiline
        sx={{ marginTop: 1, marginBottom: 1 }}
        id='postgreSqlUri'
        label='Enter postgreSql URI'
        variant='outlined'
        onChange={(e) => setPostgreSqlUri(e.target.value)}
      />
      <TextField
        onChange={(e) => setNaturalLanguageQuery(e.target.value)}
        fullWidth
        multiline
        minRows={5}
        sx={{ marginBottom: 1 }}
        id='naturalLanguageQuery'
        label='Description of table, columns and column data types'
        variant='outlined'
      />
      <Button
        onClick={handleSubmit}
        variant='contained'
        sx={{ maxWidth: 1000, marginBottom: 4 }}
      >
        {loading ? 'Loading postgreSQL Data' : 'SUBMIT TO YOUR AI OVERLORDS'}
      </Button>
      {error.length > 0 ? (
        <Container
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
            border: '1px solid black',
            borderRadius: '4px',
          }}
        >
          <Typography sx={{ color: 'red' }}>{error}</Typography>
        </Container>
      ) : null}
      {serverResponse.length > 0 ? (
        <Container
          sx={{
            marginTop: 1,
            paddingTop: 1,
            paddingBottom: 1,
            border: '1px solid black',
            borderRadius: '4px',
          }}
        >
          <Typography
            sx={{
              color: 'rgb(10, 10,10)',
            }}
          >
            {serverResponse}
          </Typography>
        </Container>
      ) : null}
    </Container>
  );
};

export default DataRequest;
