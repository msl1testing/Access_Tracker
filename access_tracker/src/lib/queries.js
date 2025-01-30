// Fetch user-tool relationships
export const fetchUserTools = `
  SELECT 
        users.name AS user_name, 
        users.team AS team_name,
        tools.tool_name,
        user_tools.access_level,
        user_tools.tool_owner,
        user_tools.ms_status
  FROM user_tools
  JOIN users ON user_tools.user_id = users.user_id
  JOIN tools ON user_tools.tool_id = tools.tool_id
  ORDER BY users.name, tools.tool_name;
`;

// Insert a new user into the users table
export const addUser = async (db, name, team) => {
  const query = 'INSERT INTO users (name, team) VALUES (?, ?)';
  const [result] = await db.execute(query, [name, team]);
  return result.insertId;  // Return the newly created user ID
};
// Query to delete user from users table
export const deleteUser = `
  DELETE FROM users WHERE user_id = ?;
`;

// Query to delete related user_tools entry (if necessary)
export const deleteUserTools = `
  DELETE FROM user_tools WHERE user_id = ?;
`;

// Insert a new entry into the user_tools table
export const addUserTool = async (db, userId, toolId, accessLevel, toolOwner, msStatus) => {
  const query = `
    INSERT INTO user_tools (user_id, tool_id, access_level, tool_owner, ms_status)
    VALUES (?, ?, ?, ?, ?)
  `;
  await db.execute(query, [userId, toolId, accessLevel, toolOwner, msStatus]);
};


export const fetchUsers = `
  SELECT 
    user_id,
    name,
    team,
    email_id
  FROM users
  ORDER BY name;
`;
