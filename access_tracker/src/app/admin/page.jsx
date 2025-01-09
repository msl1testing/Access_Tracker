'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function AdminPage() {
  const [users, setUsers] = useState([]);
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

  const handleAddUserClick = () => {
    router.push('/add-users'); // Navigate to the add-users page
  };

  return (
    <div className="body" style={{ padding: '20px' }}>
      {/* Header with Add User Button */}
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

      {/* Table */}
      <div className="table" style={{ marginTop: '20px' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Team Name</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.team}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
