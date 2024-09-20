import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbard from '../component/navbard';
import { useParams } from 'react-router-dom'; // To get parentID from URL

const ParentDashboard = () => {
  const { parentID } = useParams(); // Retrieve parentID from the URL

  const [children, setChildren] = useState([]);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childClass, setChildClass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Parent ID passed to ParentDashboard:", parentID); // Log parentID
    const fetchChildren = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/parent-dashboard/${parentID}`);
        setChildren(response.data);
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [parentID]);

  const handleAddChild = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    console.log("Adding child with parentID:", parentID); // Debug log

    try {
      await axios.post('http://localhost:3001/api/add-child', {
        parentID,        // Ensure parentID is included
        name: childName,
        age: childAge,
        classInfo: childClass,
      });

      // Reset input fields and clear messages
      setChildName('');
      setChildAge('');
      setChildClass('');
      setErrorMessage('');
      setSuccessMessage('Child added successfully');

      // Refresh the child data after adding a new child
      const response = await axios.get(`http://localhost:3001/api/parent-dashboard/${parentID}`);
      setChildren(response.data);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding child:', error.response ? error.response.data : error.message);
      setErrorMessage('Error adding child');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!childName || !childAge || !childClass) {
      setErrorMessage('All fields are required');
      return false;
    }
    if (isNaN(childAge) || childAge <= 0) {
      setErrorMessage('Please enter a valid age');
      return false;
    }
    return true;
  };

  return (
    <div>
      <Navbard />
      <h1>Parent Dashboard</h1>

      <div>
        <h2>Add Child</h2>
        <input
          type="text"
          placeholder="Child's Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Child's Age"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
        />
        <input
          type="text"
          placeholder="Class"
          value={childClass}
          onChange={(e) => setChildClass(e.target.value)}
        />
        <button onClick={handleAddChild} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Child'}
        </button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>

      <div>
        <h2>Children and Details</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : children.length > 0 ? (
          children.map((child) => (
            <div key={child.ChildID} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <h3>{child.childName}</h3>
              <p>
                <strong>Age:</strong> {child.Age}
              </p>
              <p>
                <strong>Class:</strong> {child.Class}
              </p>
            </div>
          ))
        ) : (
          <p>No children added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;