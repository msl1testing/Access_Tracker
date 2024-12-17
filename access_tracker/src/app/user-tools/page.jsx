'use client'

import { useState, useEffect } from 'react';

export default function UserToolsPage() {
  const [userTools, setUserTools] = useState([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState(''); // For team name search
  const [userSearchTerm, setUserSearchTerm] = useState(''); // For user name search
  const [toolSearchTerm, setToolSearchTerm] = useState(''); // For tool name search
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
      item.tool_name.toLowerCase().includes(toolSearchTerm.toLowerCase())
    );
    setFilteredUserTools(results);
  }, [teamSearchTerm, userSearchTerm, toolSearchTerm, userTools]);

  return (
    <div>
      <h1>User Access Tracker</h1>
      
      {/* Search by team name */}
      <input
        type="text"
        placeholder="Search by team name"
        value={teamSearchTerm}
        onChange={(e) => setTeamSearchTerm(e.target.value)}
      />
      
      {/* Search by user name */}
      <input
        type="text"
        placeholder="Search by user name"
        value={userSearchTerm}
        onChange={(e) => setUserSearchTerm(e.target.value)}
      />

      {/* Search by tool name */}
      <input
        type="text"
        placeholder="Search by tool name"
        value={toolSearchTerm}
        onChange={(e) => setToolSearchTerm(e.target.value)}
      />

      <table border="1">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>User Name</th>
            <th>Tool Name</th>
            <th>Access Level</th>
            <th>Tool Owner</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserTools.length > 0 ? (
            filteredUserTools.map((item, index) => (
              <tr key={index}>
                <td>{item.team_name}</td>
                <td>{item.user_name}</td>
                <td>{item.tool_name}</td>
                <td>{item.access_level}</td>   {/* Display Access Level */}
                <td>{item.tool_owner}</td>     {/* Display Tool Owner */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>  {/* Adjusted colspan for 5 columns */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
