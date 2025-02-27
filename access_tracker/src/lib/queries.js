// Fetch user-tool relationships
export const fetchUserTools = `
  SELECT 
        users.name AS user_name, 
        users.team AS team_name,
        users.email_id,
        tools.tool_name,
        user_tools.access_level,
        user_tools.client,
        user_tools.access_group,
        user_tools.ms_status
  FROM user_tools
  JOIN users ON user_tools.user_id = users.user_id
  JOIN tools ON user_tools.tool_id = tools.tool_id
  ORDER BY users.name, tools.tool_name;
`;

// Insert a new user into the users table
export const addUser = async (db, name, team, email_id) => {
  const query = `INSERT INTO users (name, team, email_id) VALUES (?, ?, ?)`;
  const [result] = await db.execute(query, [name, team, email_id]);
  return result.insertId;  // Return the newly created user ID
};

// Query to delete user from users table
export const deleteUser = `DELETE FROM users WHERE user_id = ?;`;

// Query to delete related user_tools entry
export const deleteUserTools = `DELETE FROM user_tools WHERE user_id = ?;`;


// Fetch all users
export const fetchUsers = `
  SELECT 
    user_id,
    name,
    team,
    email_id
  FROM users
  ORDER BY name;
`;

export const fetchClientTools = `
  SELECT DISTINCT user_tools.client, tools.tool_name
  FROM user_tools
  JOIN tools ON user_tools.tool_id = tools.tool_id
  WHERE user_tools.client IS NOT NULL
  ORDER BY user_tools.client, tools.tool_name;
`;

export const fetchToolClients = `
  SELECT DISTINCT tools.tool_name, user_tools.client
  FROM user_tools
  JOIN tools ON user_tools.tool_id = tools.tool_id
  WHERE user_tools.client IS NOT NULL
  ORDER BY tools.tool_name, user_tools.client;
`;

