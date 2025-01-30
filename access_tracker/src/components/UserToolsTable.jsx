'use client';

import { useState, useEffect } from 'react';

export default function UserToolsTable({ data, searchTerms, setSearchTerms }) {
  const [filteredUserTools, setFilteredUserTools] = useState([]);

  useEffect(() => {
    const results = data.filter((item) =>
      item.team_name.toLowerCase().includes(searchTerms.team.toLowerCase()) &&
      item.user_name.toLowerCase().includes(searchTerms.user.toLowerCase()) &&
      item.tool_name.toLowerCase().includes(searchTerms.tool.toLowerCase()) &&
      item.tool_owner.toLowerCase().includes(searchTerms.client.toLowerCase())
    );
    setFilteredUserTools(results);
  }, [searchTerms, data]);

  return (
    <div className="body">
      <h1>User Access Tracker</h1>

      {/* Search Inputs */}
      <div className="searchField">
        <input
          type="text"
          placeholder="Search by team name"
          value={searchTerms.team}
          onChange={(e) => setSearchTerms((prev) => ({ ...prev, team: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search by user name"
          value={searchTerms.user}
          onChange={(e) => setSearchTerms((prev) => ({ ...prev, user: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search by tool name"
          value={searchTerms.tool}
          onChange={(e) => setSearchTerms((prev) => ({ ...prev, tool: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search by client"
          value={searchTerms.client}
          onChange={(e) => setSearchTerms((prev) => ({ ...prev, client: e.target.value }))}
        />
      </div>

      {/* Table */}
      <div className="table">
        <table border="1">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>User Name</th>
              <th>Tool Name</th>
              <th>Access Level</th>
              <th>Client</th>
              <th>MS Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserTools.length > 0 ? (
              filteredUserTools.map((item, index) => (
                <tr key={index}>
                  <td>{item.team_name}</td>
                  <td>{item.user_name}</td>
                  <td>{item.tool_name}</td>
                  <td>{item.access_level}</td>
                  <td>{item.tool_owner}</td>
                  <td>{item.ms_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
