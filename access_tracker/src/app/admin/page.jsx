'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Modal for authentication
const AuthModal = ({ onAuthenticate, onClose, errorMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onAuthenticate(username, password);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Admin Access</h2>
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
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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

// Confirm delete modal
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Are you sure you want to delete this user?</h3>
        <p>This action cannot be reverted.</p>
        <button onClick={() => { onConfirm(); onClose(); }} className="modal-button-confirm">
          Confirm
        </button>
        <button onClick={onClose} className="modal-button-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Authentication function
  const authenticate = (enteredUsername, enteredPassword) => {
    const validUsername = 'admin';
    const validPassword = '12345678';

    if (enteredUsername === validUsername && enteredPassword === validPassword) {
      setIsAuthenticated(true);
      setIsModalOpen(false); // Close the authentication modal after successful login
    } else {
      setErrorMessage('Authentication failed. Access restricted.');
    }
  };

  // Fetch users if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      async function fetchData() {
        try {
          const response = await fetch('/api/admin');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
      fetchData();
    }
  }, [isAuthenticated]);

  // Function to handle delete user
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/${userIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user.user_id !== userIdToDelete));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleAddUserClick = () => {
    router.push('/add-users'); // Navigate to the add-users page
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setUserIdToDelete(null);
  };

  // If not authenticated, show the authentication modal
  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={authenticate} onClose={() => setIsModalOpen(false)} errorMessage={errorMessage} />;
  }

  return (
    <div className="body">
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Page</h1>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleAddUserClick} // Call the function to navigate
        >
          Add User
        </button>
      </div>

      <div className="table" style={{ marginTop: '20px' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team Name</th>
              <th>Email ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.team}</td>
                  <td>{user.email_id}</td>
                  <td>
                    <button>
                      <FaEdit className="icon" />
                    </button>
                    <button onClick={() => openDeleteModal(user.user_id)}>
                      <FaTrashAlt className="icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
