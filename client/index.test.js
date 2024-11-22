/**
 * @jest-environment jsdom
 *
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import App from './App.jsx';

describe('App component', () => {
  it('renders app', () => {
    render(<App />);
    expect(screen.getByText("Data Wizard")).toBeInTheDocument();
  });
});
