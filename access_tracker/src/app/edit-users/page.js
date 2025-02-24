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

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleToolChange = (index, field, value) => {
    const updatedTools = [...userTools];
    updatedTools[index][field] = value;
    setUserTools(updatedTools);
  };

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

  const handleToolUpdate = async (tool) => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool),
      });

      if (!response.ok) throw new Error('Failed to update user-tool entry');
      alert('User-Tool entry updated successfully!');
      fetchUserToolsData();
    } catch (error) {
      console.error('Error updating user-tool entry:', error);
    }
  };

  const handleAddUserTool = async () => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTool),
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userTools.map((tool, index) => (
              <tr key={index}>
                <td>{tool.tool_id}</td>
                <td>{tool.tool_name}</td>
                <td>
                  <input type="text" value={tool.access_level} onChange={(e) => handleToolChange(index, 'access_level', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={tool.client} onChange={(e) => handleToolChange(index, 'client', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={tool.ms_status} onChange={(e) => handleToolChange(index, 'ms_status', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={tool.access_group} onChange={(e) => handleToolChange(index, 'access_group', e.target.value)} />
                </td>
                <td>
                  <button onClick={() => handleToolUpdate(tool)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tools assigned.</p>
      )}

      <h3>Add New Tool</h3>
      <label>Tool ID: <input type="number" name="tool_id" value={newTool.tool_id} onChange={(e) => setNewTool({ ...newTool, tool_id: e.target.value })} /></label>
      <label>Access Level: <input type="text" name="access_level" value={newTool.access_level} onChange={(e) => setNewTool({ ...newTool, access_level: e.target.value })} /></label>
      <label>Client: <input type="text" name="client" value={newTool.client} onChange={(e) => setNewTool({ ...newTool, client: e.target.value })} /></label>
      <label>MS Status: <input type="text" name="ms_status" value={newTool.ms_status} onChange={(e) => setNewTool({ ...newTool, ms_status: e.target.value })} /></label>
      <label>Access Group: <input type="text" name="access_group" value={newTool.access_group} onChange={(e) => setNewTool({ ...newTool, access_group: e.target.value })} /></label>
      <button onClick={handleAddUserTool}>Add Tool</button>
    </div>
  );
};

export default EditUserPage;
