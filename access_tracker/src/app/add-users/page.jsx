'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddUserPage = () => {
  const [user, setUser] = useState({ name: '', team: '', email_id: '' });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('User added successfully!');
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
      <h1>Add New User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={user.name} onChange={handleInputChange} required />
        </label>
        <label>
          Team:
          <input type="text" name="team" value={user.team} onChange={handleInputChange} required />
        </label>
        <label>
          Email ID:
          <input type="email" name="email_id" value={user.email_id} onChange={handleInputChange} required />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUserPage;
