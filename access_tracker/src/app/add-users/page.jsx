'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Modal Component for Authentication
const Modal = ({ onClose, onAuthenticate, errorMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onAuthenticate(username, password);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Restricted Access</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error if authentication fails */}
          <div>
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddEntryPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal visibility
  const [user, setUser] = useState({ name: '', team: '' });
  const [tool, setTool] = useState({ tool_id: '', access_level: '', tool_owner: '', ms_status: 'NA' });
  const [errorMessage, setErrorMessage] = useState(''); // Error message for failed authentication
  const router = useRouter(); // Initialize useRouter for navigation

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
        router.push('/admin'); // Redirect to the Admin page upon success
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Request failed: ${error.message}`);
    }
  };

  // Authentication function
  const authenticate = (enteredUsername, enteredPassword) => {
    const validUsername = 'admin'; // Replace with your desired username
    const validPassword = '12345678'; // Replace with your desired password

    if (enteredUsername === validUsername && enteredPassword === validPassword) {
      console.log('Authentication successful');
      setIsAuthenticated(true);
      setIsModalOpen(false); // Close the modal after successful authentication
    } else {
      console.log('Authentication failed. Access restricted.');
      setIsAuthenticated(false);
      setErrorMessage('Authentication failed. Access restricted.');
    }
  };

  // If not authenticated, show the modal
  if (isModalOpen) {
    return <Modal onAuthenticate={authenticate} onClose={() => setIsModalOpen(false)} errorMessage={errorMessage} />;
  }

  // If authentication failed
  if (isAuthenticated === false) {
    return (
      <div className="body">
        <h1>Access Restricted</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // If authenticated, show the main form
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
