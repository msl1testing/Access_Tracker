'use client';

import { useEffect, useState } from 'react';
import "./styles.module.css";

export default function UserTools() {
  const [userTools, setUserTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-tools');
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);  // Check the structure here
          setUserTools(data);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Access Tracker</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Tools </th>
            </tr>
          </thead>
          <tbody>
            {userTools.length > 0 ? (
              userTools.map((item, index) => (
                <tr key={index}>
                  <td>{item.user_name}</td>
                  <td>{item.tools}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
  
}
