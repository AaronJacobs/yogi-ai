/**
 * @jest-environment jsdom
 *
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import DataRequest from './DataRequest';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve('Query was successful'),
  })
);

test('updates state for URI on user input', () => {
  render(<DataRequest />);

  const uriInput = screen.getByLabelText(/Enter postgreSql URI/i);

  fireEvent.change(uriInput, { target: { value: 'great test uri' } });

  expect(uriInput.value).toBe('great test uri');
});

test('updates state for query on user input', () => {
  render(<DataRequest />);

  const queryInput = screen.getByLabelText(
    /Description of table, columns, and number of rows/i
  );

  fireEvent.change(queryInput, { target: { value: 'I am asking for data' } });

  expect(queryInput.value).toBe('I am asking for data');
});

test('state changes to loading on button click and back upon completion of request', async () => {
  render(<DataRequest />);

  fireEvent.change(screen.getByLabelText(/Enter postgreSql URI/i), {
    target: { value: 'great test uri' },
  });

  fireEvent.change(
    screen.getByLabelText(/Description of table, columns, and number of rows/i),
    {
      target: { value: 'I am asking for data' },
    }
  );
  fireEvent.click(
    screen.getByRole('button', { name: /SUBMIT TO YOUR AI OVERLORDS/i })
  );

  expect(
    screen.getByRole('button', {
      name: /Loading postgreSQL Data/i,
    })
  ).toBeInTheDocument();

  await waitFor(() => screen.getByText('Query was successful'));

  expect(screen.getByText('Query was successful')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent(
    'SUBMIT TO YOUR AI OVERLORDS'
  );
});
