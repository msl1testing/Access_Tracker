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
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="heading">Add User</h1>
        <div className="button-group">
          <button className="button" onClick={() => router.push('/admin')}>Admin</button>
          <button className="button" onClick={() => router.push('/user-tools')}>Home</button>
        </div>
      </div>

      {/* Form */}
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Name:
          <input type="text" name="name" value={user.name} onChange={handleInputChange} required className="input" />
        </label>
        <label className="label">
          Team:
          <input type="text" name="team" value={user.team} onChange={handleInputChange} required className="input" />
        </label>
        <label className="label">
          Email ID:
          <input type="email" name="email_id" value={user.email_id} onChange={handleInputChange} required className="input" />
        </label>
        <button type="submit" className="submit-button">Add User</button>
      </form>

      {/* Styles */}
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          background: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          text-align: center;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px; /* Adds spacing between heading and buttons */
          margin-bottom: 20px;
        }
        .heading {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px; /* Extra space below heading */
        }
        .button-group {
          display: flex;
          gap: 15px;
        }
        .button {
          padding: 10px 16px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
          font-size: 14px;
        }
        .button:hover {
          background-color: #2980b9;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
          text-align: left;
        }
        .input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
        .input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0px 0px 5px rgba(52, 152, 219, 0.5);
        }
        .submit-button {
          margin-top: 15px;
          padding: 12px;
          background-color: #3498db;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .submit-button:hover {
          background-color: #2980b9;
        }

        /* Responsive Design */
        @media (max-width: 400px) {
          .button-group {
            flex-direction: column;
            width: 100%;
          }
          .button {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddUserPage;
