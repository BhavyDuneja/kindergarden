import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import ParentDashboard from '../frontend/Page/parent';

// Mock axios
const mock = new AxiosMockAdapter(axios);

describe('ParentDashboard Component', () => {
  beforeEach(() => {
    // Mock the GET request to fetch child data
    const childData = [
      { ChildID: 1, Name: 'Alice', Age: 5, Class: 'Nursery', ParentID: 1 },
      { ChildID: 2, Name: 'Bob', Age: 6, Class: 'Kindergarten', ParentID: 1 },
    ];
    mock.onGet('http://localhost:3001/api/children').reply(200, childData);
  });

  afterEach(() => {
    mock.reset(); // Reset axios mock after each test
  });

  test('should fetch and display children data', async () => {
    render(<ParentDashboard />);
    
    // Check if child data is displayed in the table
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  test('should successfully add a new child', async () => {
    // Mock the POST request to add a child
    mock.onPost('http://localhost:3001/api/add-child').reply(200, { success: true });

    render(<ParentDashboard />);

    // Fill in form inputs
    fireEvent.change(screen.getByPlaceholderText('Enter child name'), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByPlaceholderText('Enter child age'), { target: { value: '4' } });
    fireEvent.change(screen.getByPlaceholderText('Enter child class'), { target: { value: 'Pre-K' } });

    // Click the Add Child button
    fireEvent.click(screen.getByText('Add Child'));

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Child added successfully')).toBeInTheDocument();
    });
  });

  test('should display error when adding a child fails', async () => {
    // Mock a failure response for the POST request
    mock.onPost('http://localhost:3001/api/add-child').reply(500);

    render(<ParentDashboard />);

    // Fill in form inputs
    fireEvent.change(screen.getByPlaceholderText('Enter child name'), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByPlaceholderText('Enter child age'), { target: { value: '4' } });
    fireEvent.change(screen.getByPlaceholderText('Enter child class'), { target: { value: 'Pre-K' } });

    // Click the Add Child button
    fireEvent.click(screen.getByText('Add Child'));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to add child')).toBeInTheDocument();
    });
  });

  test('should validate input fields before adding a child', async () => {
    render(<ParentDashboard />);

    // Leave the form fields empty and click Add Child
    fireEvent.click(screen.getByText('Add Child'));

    // Check if the form validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Child name is required')).toBeInTheDocument();
      expect(screen.getByText('Child age is required')).toBeInTheDocument();
      expect(screen.getByText('Child class is required')).toBeInTheDocument();
    });
  });
});
