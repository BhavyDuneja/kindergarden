import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbard from '../component/navbard';

const AdminPage = () => {
  const [adminData, setAdminData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchAdminData();
    fetchUserData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/api/admin-data');
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user-data');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleApprove = async (email) => {
    try {
      await axios.post('/api/approve-registration', { email });
      fetchAdminData();
      fetchUserData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (email) => {
    try {
      await axios.post('/api/reject-registration', { email });
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await axios.put(`/api/update-user/${id}`, updatedData);
      fetchUserData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/delete-user/${id}`);
        fetchUserData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <Navbard/>
      <h2>Admin Table</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>PhoneNumber</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((admin) => (
            <tr key={admin.Email}>
              <td>{admin.Role}</td>
              <td>{admin.Name}</td>
              <td>{admin.Email}</td>
              <td>{admin.Password}</td>
              <td>{admin.PhoneNumber}</td>
              <td>
                <button onClick={() => handleApprove(admin.Email)}>Approve</button>
              </td>
              <td>
                <button onClick={() => handleReject(admin.Email)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>PhoneNumber</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.Email}>
              <td>{user.Role}</td>
              <td>{user.Name}</td>
              <td>{user.Email}</td>
              <td>{user.Password}</td>
              <td>{user.PhoneNumber}</td>
              <td>
                <button onClick={() => handleUpdateUser(user.UserID, { /* Pass updated user data here */ })}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.UserID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
