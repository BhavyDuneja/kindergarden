import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom'; // For routing redirection
import Login from './Login'; // Update with the correct file path

// Mock axios
const mock = new AxiosMockAdapter(axios);

describe('Login Component', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should log in successfully and redirect to the correct dashboard', async () => {
    mock.onPost('http://localhost:3001/login').reply(200, { userId: 1, role: 'admin' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(localStorage.getItem('userId')).toBe('1');
      expect(window.location.pathname).toBe('/admin-dashboard'); // Change based on your routes
    });
  });

  test('should show error message on failed login', async () => {
    mock.onPost('http://localhost:3001/login').reply(401, { message: 'Invalid credentials' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
