'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Modal for confirming the delete action
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
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
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
  }, []);

  // Function to handle delete user
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/${userIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Filter out the deleted user from the UI
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

  return (
    <div className="body">
      {/* Header with Add User Button */}
      <div className="header">
        <h1>Admin Page</h1>
        <button onClick={handleAddUserClick} className="add-user-button">
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="table">
        <table>
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

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
