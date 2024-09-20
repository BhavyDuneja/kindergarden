
import axios from 'axios/dist/axios.js';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import TeacherDashboard from '../frontend/Page/teacher';

// Mock axios
const mock = new AxiosMockAdapter(axios);

describe('TeacherDashboard Component', () => {
  beforeEach(() => {
    mock.reset(); // Reset axios mock before each test
  });

  test('should fetch children data successfully', async () => {
    // Mock response for fetching children data
    const childrenData = [
      { ChildID: 1, Name: 'John Doe', ChildAge: 5, ChildClass: 'Nursery' },
    ];
    mock.onGet('http://localhost:3001/api/children?parentID=1').reply(200, childrenData);

    render(<TeacherDashboard parentID={1} />);

    // Wait for children to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Nursery')).toBeInTheDocument();
    });
  });

  test('should show "No children added" when there is no data', async () => {
    // Mock empty response
    mock.onGet('http://localhost:3001/api/children?parentID=1').reply(200, []);

    render(<TeacherDashboard parentID={1} />);

    // Wait for the empty state message
    await waitFor(() => {
      expect(screen.getByText('No children added')).toBeInTheDocument();
    });
  });

  test('should add child with valid data', async () => {
    // Mock successful child addition
    mock.onPost('http://localhost:3001/api/children').reply(200);

    render(<TeacherDashboard parentID={1} />);

    // Fill in valid child data
    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Nursery' } });

    // Submit form
    fireEvent.click(screen.getByText('Add Child'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Child added successfully')).toBeInTheDocument();
    });
  });

  test('should prevent adding a child with empty fields', async () => {
    render(<TeacherDashboard parentID={1} />);

    // Leave fields empty
    fireEvent.click(screen.getByText('Add Child'));

    // Ensure validation prevents submission
    await waitFor(() => {
      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });
  });

  test('should prevent adding a child with invalid age (non-numeric)', async () => {
    render(<TeacherDashboard parentID={1} />);

    // Fill in invalid age
    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: 'five' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Nursery' } });

    fireEvent.click(screen.getByText('Add Child'));

    await waitFor(() => {
      expect(screen.getByText('Child age must be a valid number')).toBeInTheDocument();
    });
  });

  test('should prevent adding a child with negative age', async () => {
    render(<TeacherDashboard parentID={1} />);

    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: '-2' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Nursery' } });

    fireEvent.click(screen.getByText('Add Child'));

    await waitFor(() => {
      expect(screen.getByText('Age must be a positive number')).toBeInTheDocument();
    });
  });

  test('should handle server error during child addition', async () => {
    // Mock server error
    mock.onPost('http://localhost:3001/api/children').reply(500);

    render(<TeacherDashboard parentID={1} />);

    // Fill in valid child data
    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Nursery' } });

    fireEvent.click(screen.getByText('Add Child'));

    await waitFor(() => {
      expect(screen.getByText('Failed to add child')).toBeInTheDocument();
    });
  });

  test('should show loading state during child data fetch', async () => {
    // Simulate a delay in fetching data
    mock.onGet('http://localhost:3001/api/children?parentID=1').reply(() => new Promise(resolve => setTimeout(() => resolve([200, []]), 1000)));

    render(<TeacherDashboard parentID={1} />);

    // Check if loading indicator is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('should show loading state during child addition', async () => {
    // Simulate a delay in adding a child
    mock.onPost('http://localhost:3001/api/children').reply(() => new Promise(resolve => setTimeout(() => resolve([200]), 1000)));

    render(<TeacherDashboard parentID={1} />);

    // Fill in valid child data
    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Nursery' } });

    fireEvent.click(screen.getByText('Add Child'));

    // Check if loading indicator is shown during addition
    expect(screen.getByText('Adding...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Adding...')).not.toBeInTheDocument();
      expect(screen.getByText('Child added successfully')).toBeInTheDocument();
    });
  });

  test('should handle invalid parentID in URL', async () => {
    // Mock server response for invalid parentID
    mock.onGet('http://localhost:3001/api/children?parentID=invalid').reply(400);

    render(<TeacherDashboard parentID="invalid" />);

    await waitFor(() => {
      expect(screen.getByText('Invalid parent ID')).toBeInTheDocument();
    });
  });

  test('should clear success message after 3 seconds', async () => {
    // Mock successful child addition
    mock.onPost('http://localhost:3001/api/children').reply(200);

    render(<TeacherDashboard parentID={1} />);

    // Fill in valid child data
    fireEvent.change(screen.getByPlaceholderText('Child Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText('Child Age'), { target: { value: '6' } });
    fireEvent.change(screen.getByPlaceholderText('Child Class'), { target: { value: 'Class A' } });

    fireEvent.click(screen.getByText('Add Child'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Child added successfully')).toBeInTheDocument();
    });

    // Wait for 3 seconds to clear message
    await waitFor(() => {
      expect(screen.queryByText('Child added successfully')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

