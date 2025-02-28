'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const EditUserPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const router = useRouter();

  const [user, setUser] = useState({ name: '', team: '', email_id: '' });
  const [userTools, setUserTools] = useState([]);
  const [newTool, setNewTool] = useState({ tool_id: '', access_level: '', client: '', ms_status: '', access_group: '' });
  const [availableTools, setAvailableTools] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [isAddTool, setIsAddTool] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);

  const handleHomeClick = () => {
    router.push('/user-tools'); // Navigate to the add-users page
  };

  const handleAdminClick = () => {
    router.push('/admin'); // Navigate to the add-users page
  };
  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserToolsData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchUserToolsData = async () => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user-tools details');
      const data = await response.json();
      setUserTools(data);
    } catch (error) {
      console.error('Error fetching user-tools:', error);
    }
  };
  const fetchAvailableTools = async () => {
    try {
      const response = await fetch('/api/availabletools'); // Fetch available tools
      if (!response.ok) throw new Error('Failed to fetch available tools');
      const data = await response.json();
      setAvailableTools(data);
    } catch (error) {
      console.error('Error fetching available tools:', error);
    }
  };
  
  const fetchAccessLevels = async (toolId) => {
    if (!toolId) return;
    try {
      const response = await fetch(`/api/accesslevels?tool_id=${toolId}`);
      if (!response.ok) throw new Error('Failed to fetch access levels');
      const data = await response.json();
      console.log('Access Levels:', data);  // Debugging
      setAccessLevels(data);
    } catch (error) {
      console.error('Error fetching access levels:', error);
    }
  };

  const handleEditUser = () => {
    setIsEditUser(true)
  };
  
  const handleCancelEditUser = () => {
    setIsEditUser(false)
  }

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleToolChange = (index, field, value) => {
    const updatedTools = [...userTools];
    updatedTools[index][field] = value;
    setUserTools(updatedTools);
  };

  const handleUserUpdate = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to update user');
      alert('User updated successfully!');
      setIsEditUser(false)
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToolUpdate = async (tool) => {
    try {
      const response = await fetch(`/api/user-tools/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool),
      });

      if (!response.ok) throw new Error('Failed to update user-tool entry');
      alert('User-Tool entry updated successfully!');
      fetchUserToolsData();
    } catch (error) {
      console.error('Error updating user-tool entry:', error);
    }
  };
  const handleToolDelete = async (toolId) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
  
    try {
      const response = await fetch(`/api/user-tools/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_id: toolId }),
      });
  
      if (!response.ok) throw new Error("Failed to delete user-tool entry");
  
      alert("User-Tool entry deleted successfully!");
      fetchUserToolsData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting user-tool entry:", error);
    }
  };

  const handleNewToolChange = (e) => {
    const toolId = e.target.value;
    setSelectedTool(toolId);
    console.log("Selected Tool ID:", toolId);
    console.log("Updated newTool state:", { ...newTool, tool_id: toolId });

    // ✅ Ensure tool_id is correctly set in newTool
    setNewTool((prev) => ({ ...prev, tool_id: toolId }));
    
    setAccessLevels([]); // Reset access levels until new data is fetched
    fetchAccessLevels(toolId); // Fetch new access levels for selected tool
  };

// Fetch tools on page load
useEffect(() => {
  fetchAvailableTools();
}, []);

// Fetch access levels when tool is selected
useEffect(() => {
  if (selectedTool) {
    fetchAccessLevels(selectedTool);
  }
}, [selectedTool]);

const handleAddTool = async () => {
  setIsAddTool(true);
}

const handleAddUserTool = async () => {
  // ✅ Check if any field is empty
  if (!newTool.tool_id || !newTool.access_level || !newTool.client || !newTool.ms_status || !newTool.access_group) {
    alert("All fields are required!");
    return; // Stop function execution if validation fails
  }

  try {
    console.log("Submitting new tool:", newTool); // Debugging
    const response = await fetch(`/api/user-tools/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTool),
    });

    if (!response.ok) throw new Error('Failed to add user-tool entry');

    alert('User-Tool entry added successfully!');
    fetchUserToolsData();
    setIsAddTool(false);
    // ✅ Reset the form after successful submission
    setNewTool({ tool_id: '', access_level: '', client: '', ms_status: '', access_group: '' });
    setSelectedTool(''); // ✅ Reset the selected tool dropdown
    setAccessLevels([]); // ✅ Reset access levels since no tool is selected
  } catch (error) {
    console.error('Error adding user-tool entry:', error);
    alert("Failed to add user-tool entry. Please try again.");
  }
};
  const handleCancelTool = () => {
    setIsAddTool(false);
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <div style={{ flex: 1, textAlign: 'center' }}>
    <h1>Edit User Details</h1>
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
      onClick={handleAdminClick} // Call the function to navigate
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
      onClick={handleHomeClick} // Call the function to navigate
    >
      Home
    </button>
  </div>
</div>

      {/* User Details Section */}
       <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <div style={{ flex: 1 }}>
    <h3 style={styles.subHeading}>{user.name} </h3>
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
      onClick={handleEditUser} // Call the function to navigate
    >
      Edit Info
    </button>
    </div>
    </div>
    {isEditUser && 
    <div>
        <div style={styles.formGroup}>
          <label>Name:</label>
          <input type="text" name="name" value={user.name} onChange={handleUserChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Team:</label>
          <input type="text" name="team" value={user.team} onChange={handleUserChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input type="email" name="email_id" value={user.email_id} onChange={handleUserChange} style={styles.input} />
        </div>
        <button onClick={handleUserUpdate} style={styles.button}>Update User</button>
        <button onClick={handleCancelEditUser} style={styles.button}>Cancel</button>
        </div>
    }
      </div>

      {/* User-Tools Details Section */}
      <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <div style={{ flex: 1 }}>
    <h3 style={styles.subHeading}> Tools</h3>
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
      onClick={handleAddTool} // Call the function to navigate
    >
      Add Tool
    </button>
    </div>
    </div>
      {userTools.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Tool ID</th>
              <th>Tool Name</th>
              <th>Access Level</th>
              <th>Client</th>
              <th>MS Status</th>
              <th>Access Group</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userTools.map((tool, index) => (
              <tr key={index}>
                <td>{tool.tool_id}</td>
                <td>{tool.tool_name}</td>
                <td>
                  <input type="text" value={tool.access_level} onChange={(e) => handleToolChange(index, 'access_level', e.target.value)} />
                </td>
                <td>{tool.client}</td>
                <td>{tool.ms_status}</td>
                <td>{tool.access_group}</td>
                <td>
                  <button onClick={() => handleToolUpdate(tool)} style={{ marginRight: "10px" }}>
                  <FaEdit className="icon" />
                  </button>
                  <button onClick={() => handleToolDelete(tool.tool_id)}>
                  <FaTrashAlt className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tools assigned.</p>
      )}
      </div>

      {/* Add New Tool Section */}
     {isAddTool && <div style={styles.card}>
        <h3 style={styles.subHeading}>Add New Tool</h3>

       {/* Tool Dropdown */}
<div style={styles.formGroup}>
  <label>Tool ID:</label>
  <select value={selectedTool} onChange={handleNewToolChange} style={styles.input}>
    <option value="">Select a tool</option>
    {availableTools.length > 0 ? (
      availableTools.map((tool) => (
        <option key={tool.tool_id} value={tool.tool_id}>
          {tool.tool_name} (ID: {tool.tool_id})
        </option>
      ))
    ) : (
      <option disabled>Loading tools...</option>
    )}
  </select>
</div>

        <div style={styles.formGroup}>
  <label>Access Level:</label>
  <select name="access_level" value={newTool.access_level} onChange={(e) => setNewTool({ ...newTool, access_level: e.target.value })} style={styles.input}>
    <option value="">Select an access level</option>
    {accessLevels.length > 0 ? (
      accessLevels.map((level, index) => (
        <option key={index} value={level.access_level}>
          {level.access_level}
        </option>
      ))
    ) : (
      <option disabled>Select a tool first</option>
    )}
  </select>
</div>
        <div style={styles.formGroup}>
          <label>Client:</label>
          <input type="text" name="client" value={newTool.client} onChange={(e) => setNewTool({ ...newTool, client: e.target.value })} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>MS Status:</label>
          <input type="text" name="ms_status" value={newTool.ms_status} onChange={(e) => setNewTool({ ...newTool, ms_status: e.target.value })} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Access Group:</label>
          <input type="text" name="access_group" value={newTool.access_group} onChange={(e) => setNewTool({ ...newTool, access_group: e.target.value })} style={styles.input} />
        </div>
        <button onClick={handleAddUserTool} style={styles.button}>Add Tool</button>
        <button onClick={handleCancelTool} style={styles.button}>Cancel</button>
      </div>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    padding: '0 20px',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
  },
  card: {
    background: '#fff',
    padding: '20px',
    margin: '20px 0',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  subHeading: {
    borderBottom: '2px solid #ddd',
    paddingBottom: '5px',
    marginBottom: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '90%',
  },
  button: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  tableContainer: {
    overflowX: 'auto', // Allows table scrolling on small screens
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  '@media (max-width: 768px)': {
    heading: {
      fontSize: '24px',
    },
    card: {
      padding: '15px',
    },
    input: {
      padding: '8px',
    },
    button: {
      padding: '8px',
    },
    table: {
      fontSize: '14px',
    },
  },
};


export default EditUserPage;
