'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ToolsPage = () => {
  const [clientTools, setClientTools] = useState({});
  const [toolClients, setToolClients] = useState({});
  const [expandedClient, setExpandedClient] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const router = useRouter(); // ✅ Initialize router

  const handleAdminClick = () => {
    router.push('/admin');
  };

  const handleUserToolsClick = () => {
    router.push('/user-tools');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tools');
        if (!response.ok) throw new Error('Failed to fetch tools');
        const data = await response.json();
        setClientTools(data.clientTools);
        setToolClients(data.toolClients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleClient = (client) => {
    setExpandedClient(expandedClient === client ? null : client);
  };

  const toggleTool = (tool) => {
    setExpandedTool(expandedTool === tool ? null : tool);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="page-title">Clients & Tools</h1>
        <div className="button-group">
          <button className="button" onClick={handleAdminClick}>Admin</button>
          <button className="button" onClick={handleUserToolsClick}>Home</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Left Column - Clients */}
        <div className="column">
          <h2 className="column-title">Clients</h2>
          <input
            type="text"
            placeholder="Search clients..."
            value={clientSearchQuery}
            onChange={(e) => setClientSearchQuery(e.target.value)}
            className="search-bar"
          />
          {Object.keys(clientTools)
            .filter(client => client.toLowerCase().includes(clientSearchQuery.toLowerCase()))
            .map((client) => (
              <div key={client} className="item">
                <div className="item-header" onClick={() => toggleClient(client)}>
                  <span>{client}</span>
                  <span className="icon">{expandedClient === client ? '−' : '▼'}</span>
                </div>
                {expandedClient === client && (
                  <ul className="list">
                    {clientTools[client].map((tool, index) => (
                      <li key={index} className="list-item">{tool}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          }
        </div>

        {/* Right Column - Tools */}
        <div className="column">
          <h2 className="column-title">Tools</h2>
          <input
            type="text"
            placeholder="Search tools..."
            value={toolSearchQuery}
            onChange={(e) => setToolSearchQuery(e.target.value)}
            className="search-bar"
          />
          {Object.keys(toolClients)
            .filter(tool => tool.toLowerCase().includes(toolSearchQuery.toLowerCase()))
            .map((tool) => (
              <div key={tool} className="item">
                <div className="item-header" onClick={() => toggleTool(tool)}>
                  <span>{tool}</span>
                  <span className="icon">{expandedTool === tool ? '−' : '▼'}</span>
                </div>
                {expandedTool === tool && (
                  <ul className="list">
                    {toolClients[tool].map((client, index) => (
                      <li key={index} className="list-item">{client}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          }
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        .container {
          width: 100%;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 2px solid #ccc;
          margin-bottom: 20px;
        }
        .page-title {
          font-size: 24px;
          font-weight: bold;
        }
        .button-group {
          display: flex;
          gap: 10px;
        }
        .button {
          padding: 10px 20px;
          background-color: #3498db;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .content {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .column {
          width: 45%;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }
        .column-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .item {
          background: #fff;
          border-radius: 8px;
          margin-bottom: 10px;
          padding: 10px;
          cursor: pointer;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: bold;
        }
        .list {
          margin-top: 10px;
          padding: 10px;
          background: #fff;
          border-radius: 8px;
          list-style-type: none;
        }
        .list-item {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        .list-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default ToolsPage;
