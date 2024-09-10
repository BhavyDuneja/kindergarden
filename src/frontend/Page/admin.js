import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbard from '../component/navbard';

const AdminPage = () => {
  const [adminData, setAdminData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [updateData, setUpdateData] = useState({}); // Holds data for updating a user

  useEffect(() => {
    fetchAdminData();
    fetchUserData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin-data');
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user-data');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleApprove = async (email) => {
    try {
      await axios.post('http://localhost:3001/api/approve-registration', { email });
      fetchAdminData();
      fetchUserData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (email) => {
    try {
      await axios.post('http://localhost:3001/api/reject-registration', { email });
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/update-user/${id}`, updateData);
      fetchUserData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/delete-user/${id}`);
      fetchUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  return (
    <div>
      <Navbard />
      <h2>Admin Table</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>PhoneNumber</th>
            <th>Action 1</th>
            <th>Action 2</th>
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
            <th>Action 1</th>
            <th>Action 2</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.UserID}>
              <td>{user.Role}</td>
              <td>{user.Name}</td>
              <td>{user.Email}</td>
              <td>{user.Password}</td>
              <td>{user.PhoneNumber}</td>
              <td>
                <button onClick={() => setUpdateData({ ...user })}>
                  Update
                </button>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.UserID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {updateData.UserID && (
        <div>
          <h2>Update User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser(updateData.UserID);
            }}
          >
            <label>
              Role:
              <input
                type="text"
                name="Role"
                value={updateData.Role || ''}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Name:
              <input
                type="text"
                name="Name"
                value={updateData.Name || ''}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="Email"
                value={updateData.Email || ''}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="Password"
                value={updateData.Password || ''}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Phone Number:
              <input
                type="text"
                name="PhoneNumber"
                value={updateData.PhoneNumber || ''}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="submit">Update User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
