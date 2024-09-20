import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import AdminDashboard from '../frontend/Page/admin.js'; // Update with the correct file path

// Mock axios
const mock = new AxiosMockAdapter(axios);

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    // Mock GET request to fetch admin data
    mock.onGet('http://localhost:3001/api/admin').reply(200, [
      { UserID: 1, Name: 'John Doe', Role: 'admin', Email: 'john@doe.com' },
      { UserID: 2, Name: 'Jane Smith', Role: 'user', Email: 'jane@smith.com' },
    ]);
  });

  afterEach(() => {
    mock.reset();
  });

  test('should fetch and display admin data', async () => {
    render(<AdminDashboard />);

    // Check if data is displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@smith.com')).toBeInTheDocument();
    });
  });

  test('should approve a user', async () => {
    mock.onPost('http://localhost:3001/api/approve-user').reply(200, { success: true });

    render(<AdminDashboard />);

    // Approve the first user
    fireEvent.click(screen.getAllByText('Approve')[0]);

    await waitFor(() => {
      expect(screen.getByText('User approved successfully')).toBeInTheDocument();
    });
  });

  test('should reject a user', async () => {
    mock.onDelete('http://localhost:3001/api/reject-user').reply(200, { success: true });

    render(<AdminDashboard />);

    // Reject the second user
    fireEvent.click(screen.getAllByText('Reject')[1]);

    await waitFor(() => {
      expect(screen.getByText('User rejected successfully')).toBeInTheDocument();
    });
  });
});
