import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RegisterScreen from '../frontend/Page/register.js'; // Adjust the path as necessary
import '@testing-library/jest-dom'; // For matchers like 'toBeInTheDocument'

// Set up Axios mock
const mock = new MockAdapter(axios);

describe('RegisterScreen Input Tests', () => {

  afterEach(() => {
    mock.reset(); // Reset mocks after each test
  });

  test('Successful registration with valid inputs', async () => {
    mock.onPost('http://localhost:3001/register').reply(200, 'Registration Successful');
    
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'teacher' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration Successful')).toBeInTheDocument();
    });
  });

  test('Error when required fields are missing', async () => {
    render(<RegisterScreen />);
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Please fill all required fields/i)).toBeInTheDocument();
  });

  test('Passwords do not match', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'parent' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password321' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '9876543210' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('Invalid email format', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Admin User' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'adminexample.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'adminpass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'adminpass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Error during registration/i)).toBeInTheDocument();
  });

  test('Short password (less than 8 characters)', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'teacher' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Teacher One' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'teacher1@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'pass' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'pass' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '0123456789' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Error during registration/i)).toBeInTheDocument();
  });

  test('Phone number with letters', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'parent' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Parent Two' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'parent2@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: 'abc123xyz' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Error during registration/i)).toBeInTheDocument();
  });

  test('Successful registration as an admin', async () => {
    mock.onPost('http://localhost:3001/register').reply(200, 'Registration Successful');
    
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Super Admin' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'admin@domain.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'securePass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'securePass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '0987654321' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration Successful')).toBeInTheDocument();
    });
  });

  test('Display error when registration fails due to server issue', async () => {
    mock.onPost('http://localhost:3001/register').reply(500);

    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'teacher' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Teacher User' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'teacher@school.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'teacherPass' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'teacherPass' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '7777777777' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Error during registration/i)).toBeInTheDocument();
  });

  test('Phone number missing', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'parent' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'Parent User' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'parent@home.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'parentPass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'parentPass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Please fill all required fields/i)).toBeInTheDocument();
  });

  test('SQL Injection attempt via name field', async () => {
    render(<RegisterScreen />);
    
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'parent' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: "' OR 1=1; --" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@inject.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'injectPass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'injectPass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '1111111111' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Error during registration/i)).toBeInTheDocument();
  });
});
