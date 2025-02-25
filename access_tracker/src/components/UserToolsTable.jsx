'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF export
import autoTable from 'jspdf-autotable'; // Import autoTable for table formatting in PDF

export default function UserToolsTable({ data = [], searchTerms, setSearchTerms }) {
  const [filteredUserTools, setFilteredUserTools] = useState([]);
  const [exportDropdown, setExportDropdown] = useState(false); // Toggle dropdown
  const router = useRouter();

  useEffect(() => {
    if (!data.length) return; // Prevents filtering when no data is available

    const results = data.filter((item) =>
      (item.team_name || '').toLowerCase().includes((searchTerms.team || '').toLowerCase()) &&
      (item.user_name || '').toLowerCase().includes((searchTerms.user || '').toLowerCase()) &&
      (item.tool_name || '').toLowerCase().includes((searchTerms.tool || '').toLowerCase()) &&
      (item.client || '').toLowerCase().includes((searchTerms.client || '').toLowerCase()) &&
      (item.access_group || '').toLowerCase().includes((searchTerms.access_group || '').toLowerCase())
    );

    setFilteredUserTools(results);
  }, [searchTerms, data]);

  const handleAdminClick = () => {
    router.push('/admin'); 
  };

  const handleToolsClick = () => {
    router.push('/tools'); 
  };

  const exportCSV = () => {
    const csvContent = [
      ['Team Name', 'User Name', 'Tool Name', 'Access Level', 'Client', 'Access Group', 'MS SOW Status'],
      ...filteredUserTools.map(item => [
        item.team_name,
        item.user_name,
        item.tool_name,
        item.access_level,
        item.client,
        item.access_group,
        item.ms_status
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_access_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('User Access Data', 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Team Name', 'User Name', 'Tool Name', 'Access Level', 'Client', 'Access Group', 'MS SOW Status']],
      body: filteredUserTools.map(item => [
        item.team_name,
        item.user_name,
        item.tool_name,
        item.access_level,
        item.client,
        item.access_group,
        item.ms_status
      ]),
    });

    doc.save('user_access_data.pdf');
  };

  return (
    <div className="body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1>User Access Tracker</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleAdminClick}
          >
            Admin
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleToolsClick}
          >
            Tools
          </button>
          {/* Export Button */}
          <div style={{ position: 'relative' }}>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => setExportDropdown(!exportDropdown)}
            >
              Export ▼
            </button>
            {/* Dropdown Menu */}
            {exportDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                  width: '120px',
                }}
              >
                <button
                  onClick={exportCSV}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'black'
                  }}
                >
                  📄 CSV
                </button>
                <button
                  onClick={exportPDF}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'black'
                  }}
                >
                  📑 PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Inputs */}
      <div className="searchField" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['team', 'user', 'tool', 'client', 'access_group'].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={`Search by ${field.replace('_', ' ')}`}
            value={searchTerms[field] || ''}
            onChange={(e) => setSearchTerms((prev) => ({ ...prev, [field]: e.target.value }))}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '200px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
          />
        ))}
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
              <th>Access Group</th>
              <th>MS SOW Status</th>
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
                  <td>{item.client}</td>
                  <td>{item.access_group}</td>
                  <td>{item.ms_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
