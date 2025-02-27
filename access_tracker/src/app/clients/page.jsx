"use client";

import { useState, useEffect } from "react";

export default function ClientToolsTable() {
  const [clientTools, setClientTools] = useState([]);
  const [searchTerms, setSearchTerms] = useState({ client: "", tool: "" });
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/tools");
        if (!res.ok) throw new Error("Failed to fetch data");
  
        const data = await res.json();
        console.log("API Response:", data); // Debugging: Log API response
  
        if (!data.clientTools || typeof data.clientTools !== "object") {
          console.error("Unexpected API response structure:", data);
          return;
        }
  
        // Convert { client: [tools] } → [{ client, tool }]
        const formattedData = Object.entries(data.clientTools).flatMap(([client, tools]) => {
          if (!Array.isArray(tools)) {
            console.error(`Unexpected tools data for client "${client}":`, tools);
            return [];
          }
          return tools.map((tool) => ({ client, tool }));
        });
  
        setClientTools(formattedData);
      } catch (error) {
        console.error("Error fetching client tools:", error);
      }
    }
  
    fetchData();
  }, []);
  
  const filteredData = clientTools.filter(
    ({ client, tool }) =>
      client.toLowerCase().includes(searchTerms.client.toLowerCase()) &&
      tool.toLowerCase().includes(searchTerms.tool.toLowerCase())
  );

  return (
    <div className="body">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Client Tools</h1>

      {/* Search Inputs */}
      <div className="searchField" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {["client", "tool"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={`Search by ${field}`}
            value={searchTerms[field] || ""}
            onChange={(e) => setSearchTerms((prev) => ({ ...prev, [field]: e.target.value }))}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* Table */}
      <div className="table">
        <table border="1">
          <thead>
            <tr>
              <th>Client</th>
              <th>Tool</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(({ client, tool }, index) => (
                <tr key={index}>
                  <td>{client}</td>
                  <td>{tool}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 