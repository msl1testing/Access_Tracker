'use client';

import { useState, useEffect } from 'react';

export default function UserToolsPage() {
  const [userTools, setUserTools] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState(''); // For team name search
  const [userSearchTerm, setUserSearchTerm] = useState(''); // For user name search
  const [toolSearchTerm, setToolSearchTerm] = useState(''); // For tool name search
  const [clientSearchTerm, setClientSearchTerm] = useState(''); // For client search
  const [filteredUserTools, setFilteredUserTools] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/user-tools');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUserTools(data);
      } catch (error) {
        console.error('Error fetching user tools:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const results = userTools.filter((item) =>
      item.team_name.toLowerCase().includes(teamSearchTerm.toLowerCase()) &&
      item.user_name.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
      item.tool_name.toLowerCase().includes(toolSearchTerm.toLowerCase()) &&
      item.tool_owner.toLowerCase().includes(clientSearchTerm.toLowerCase()) // Filter by client
    );
    setFilteredUserTools(results);
  }, [teamSearchTerm, userSearchTerm, toolSearchTerm, clientSearchTerm, userTools]);

  return (
    <div className="max-h-screen scroll-smooth">
      <h1>User Access Tracker</h1>

      {/* Search inputs in a flex container */}
      <div className="flex justify-center items-center w-full space-x-4 mt-4">
        {/* Search by team name */}
        <input
          type="text"
          placeholder="Search by team name"
          value={teamSearchTerm}
          onChange={(e) => setTeamSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        {/* Search by user name */}
        <input
          type="text"
          placeholder="Search by user name"
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        {/* Search by tool name */}
        <input
          type="text"
          placeholder="Search by tool name"
          value={toolSearchTerm}
          onChange={(e) => setToolSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        {/* Search by client name */}
        <input
          type="text"
          placeholder="Search by client"
          value={clientSearchTerm}
          onChange={(e) => setClientSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>User Name</th>
            <th>Tool Name</th>
            <th>Access Level</th>
            <th>Client</th>
            <th>MS Status</th> {/* New column for MS Status */}
          </tr>
        </thead>
        <tbody>
          {filteredUserTools.length > 0 ? (
            filteredUserTools.map((item, index) => (
              <tr key={index}>
                <td>{item.team_name}</td>
                <td>{item.user_name}</td>
                <td>{item.tool_name}</td>
                <td>{item.access_level}</td> {/* Display Access Level */}
                <td>{item.tool_owner}</td> {/* Display Tool Owner (Client) */}
                <td>{item.ms_status}</td> {/* Display MS Status */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td> {/* Adjusted colspan for 6 columns */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
