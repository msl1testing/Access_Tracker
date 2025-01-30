'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddEntryPage = () => {
  const [user, setUser] = useState({ name: '', team: '' });
  const [tool, setTool] = useState({ tool_id: '', access_level: '', tool_owner: '', ms_status: 'NA' });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in user) {
      setUser({ ...user, [name]: value });
    } else {
      setTool({ ...tool, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, tool }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Entry added successfully!');
        router.push('/admin');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Request failed: ${error.message}`);
    }
  };

  return (
    <div className="body">
      <h1>Add New Entry</h1>
      <form onSubmit={handleSubmit}>
        <h3>User Details</h3>
        <label>
          Name:
          <input type="text" name="name" value={user.name} onChange={handleInputChange} required />
        </label>
        <label>
          Team:
          <input type="text" name="team" value={user.team} onChange={handleInputChange} required />
        </label>

        <h3>Tool Details</h3>
        <label>
          Tool ID:
          <input type="number" name="tool_id" value={tool.tool_id} onChange={handleInputChange} required />
        </label>
        <label>
          Access Level:
          <input type="text" name="access_level" value={tool.access_level} onChange={handleInputChange} />
        </label>
        <label>
          Tool Owner:
          <input type="text" name="tool_owner" value={tool.tool_owner} onChange={handleInputChange} />
        </label>
        <label>
          MS Status:
          <input type="text" name="ms_status" value={tool.ms_status} onChange={handleInputChange} />
        </label>
        <br />
        <br />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default AddEntryPage;
