// Imports
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// To Test
import App from './App';

// Tests
describe('Renders main page correctly', () => {
  it('Should render the page correctly', () => {
    // Setup
    render(<App />);
    const h1 = screen.queryByText('Hello, React!');

    // Expectations
    expect(h1).not.toBeNull();
  });
});
