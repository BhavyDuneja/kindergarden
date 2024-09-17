// TeacherDashboard.js (React Frontend)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbard from '../component/navbard';

const TeacherDashboard = () => {
  const [children, setChildren] = useState([]);
  const [formData, setFormData] = useState({});
  const userId = localStorage.getItem('userId');
  const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

  useEffect(() => {
    // Fetch the list of children assigned to the teacher
    const fetchChildren = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/children', {
          params: { email: localStorage.getItem('email') }, // pass teacher's email
        });
        setChildren(response.data);
      } catch (error) {
        console.error('Error fetching children data:', error);
      }
    };

    fetchChildren();
  }, []);

  const handleChange = (childId, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [childId]: {
        ...prevData[childId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const childId of Object.keys(formData)) {
        const { arrivalTime, departureTime, temperature, healthStatus } = formData[childId];

        // Submit attendance data
        await axios.post('http://localhost:3001/api/attendance', {
          childId,
          userId,
          date: currentDate,
          arrivalTime,
          departureTime,
        });

        // Submit log data
        await axios.post('http://localhost:3001/api/logs', {
          childId,
          userId,
          temperature,
          healthStatus,
          date: currentDate,
        });
      }

      alert('Data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data');
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <Navbard/>
      <table>
        <thead>
          <tr>
            <th>Child Name</th>
            <th>Arrival Time / Departure Time</th>
            <th>Temperature</th>
            <th>Health Status</th>
          </tr>
        </thead>
        <tbody>
          {children.map(child => (
            <tr key={child.ChildID}>
              <td>{child.Name}</td>
              <td>
                <input
                  type="time"
                  placeholder="Arrival Time"
                  onChange={(e) => handleChange(child.ChildID, 'arrivalTime', e.target.value)}
                />
                <input
                  type="time"
                  placeholder="Departure Time"
                  onChange={(e) => handleChange(child.ChildID, 'departureTime', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Temperature"
                  onChange={(e) => handleChange(child.ChildID, 'temperature', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Health Status"
                  onChange={(e) => handleChange(child.ChildID, 'healthStatus', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TeacherDashboard;
