'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const EditUserPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const router = useRouter();

  const [user, setUser] = useState({ name: '', team: '', email_id: '' });
  const [userTools, setUserTools] = useState([]);
  const [newTool, setNewTool] = useState({ tool_id: '', access_level: '', client: '', ms_status: '', access_group: '' });

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserToolsData();
    }
  }, [userId]);

  // Fetch user details
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch user-tools details
  const fetchUserToolsData = async () => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user-tools details');
      const data = await response.json();
      setUserTools(data);
    } catch (error) {
      console.error('Error fetching user-tools:', error);
    }
  };
  

  // Handle input changes for user details
  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle input changes for tool details
  const handleToolChange = (e) => {
    setNewTool({ ...newTool, [e.target.name]: e.target.value });
  };

  // Update user details
  const handleUserUpdate = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to update user');
      alert('User updated successfully!');
      router.push('/admin');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Add new user-tools entry
  const handleAddUserTool = async () => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`, { // ✅ Include userId in URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: newTool.tool_id, access_level: newTool.access_level, client: newTool.client, ms_status: newTool.ms_status, access_group: newTool.access_group }),
      });
  
      if (!response.ok) throw new Error('Failed to add user-tool entry');
      
      alert('User-Tool entry added successfully!');
      fetchUserToolsData();
      setNewTool({ tool_id: '', access_level: '', client: '', ms_status: '', access_group: '' });
    } catch (error) {
      console.error('Error adding user-tool entry:', error);
    }
  };
  

  return (
    <div className="body">
      <h1>Edit User</h1>

      <h3>User Details</h3>
      <label>Name: <input type="text" name="name" value={user.name} onChange={handleUserChange} /></label>
      <label>Team: <input type="text" name="team" value={user.team} onChange={handleUserChange} /></label>
      <label>Email: <input type="email" name="email_id" value={user.email_id} onChange={handleUserChange} /></label>
      <button onClick={handleUserUpdate}>Update User</button>

      <h3>User-Tools Details</h3>
      {userTools.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Tool ID</th>
              <th>Tool Name</th>
              <th>Access Level</th>
              <th>Client</th>
              <th>MS Status</th>
              <th>Access Group</th>
            </tr>
          </thead>
          <tbody>
            {userTools.map((tool, index) => (
              <tr key={index}>
                <td>{tool.tool_id}</td>
                <td>{tool.tool_name}</td>
                <td>{tool.access_level}</td>
                <td>{tool.client}</td>
                <td>{tool.ms_status}</td>
                <td>{tool.access_group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tools assigned.</p>
      )}

      <h3>Add New Tool</h3>
      <label>Tool ID: <input type="number" name="tool_id" value={newTool.tool_id} onChange={handleToolChange} /></label>
      <label>Access Level: <input type="text" name="access_level" value={newTool.access_level} onChange={handleToolChange} /></label>
      <label>Client: <input type="text" name="client" value={newTool.client} onChange={handleToolChange} /></label>
      <label>MS Status: <input type="text" name="ms_status" value={newTool.ms_status} onChange={handleToolChange} /></label>
      <label>Access Group: <input type="text" name="access_group" value={newTool.access_group} onChange={handleToolChange} /></label>
      <button onClick={handleAddUserTool}>Add Tool</button>
    </div>
  );
};

export default EditUserPage;
