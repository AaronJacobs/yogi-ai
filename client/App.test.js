/**
 * @jest-environment jsdom
 *
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {
  toBeInTheDocument,
  toHaveTextContent,
} from '@testing-library/jest-dom';
import DataRequest from './components/DataRequest';

jest.mock('./components/DataRequest', () => {
  return () => <div data-testid='data-request'>Mock Data Request</div>;
});

test('Renders App with DataRequest component', () => {
  render(<App />);

  const dataRequestElement = screen.getByTestId('data-request');

  expect(dataRequestElement).toBeInTheDocument();
  expect(dataRequestElement).toHaveTextContent('Mock Data Request');
});
