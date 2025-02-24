'use client';

import React, { useState, useEffect } from 'react';

const ToolsPage = () => {
  const [clientTools, setClientTools] = useState({});
  const [expandedClient, setExpandedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setClientTools(data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    fetchTools();
  }, []);

  const toggleClient = (client) => {
    setExpandedClient(expandedClient === client ? null : client);
  };

  const filteredClients = Object.keys(clientTools).filter(client =>
    client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Clients & Tools</h1>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="client-list">
        {filteredClients.map((client) => (
          <div key={client} className="client">
            <div className="client-header" onClick={() => toggleClient(client)}>
              <span className="client-title">{client}</span>
              <span className="icon">{expandedClient === client ? "−" : "+"}</span>
            </div>
            {expandedClient === client && (
              <ul className="tool-list">
                {clientTools[client].map((tool, index) => (
                  <li key={index} className="tool-item">
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

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
        .title {
          flex: 1;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }
        .search-bar {
          width: 250px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .client-list {
          width: 100%;
          max-width: 800px;
          margin: auto;
        }
        .client {
          width: 100%;
          border-bottom: 1px solid #ddd;
          padding: 15px;
          background: #f9f9f9;
          cursor: pointer;
          text-align: left;
          transition: background 0.3s ease;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .client:hover {
          background: #ececec;
        }
        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          font-weight: bold;
          padding: 10px;
        }
        .icon {
          font-size: 20px;
        }
        .tool-list {
          margin-top: 10px;
          padding: 10px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          list-style-type: none;
        }
        .tool-item {
          padding: 10px;
          border-bottom: 1px solid #eee;
          font-size: 16px;
          transition: background 0.3s ease;
        }
        .tool-item:last-child {
          border-bottom: none;
        }
        .tool-item:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default ToolsPage;
