export const fetchUserTools = `
  SELECT 
        users.name AS user_name, 
        users.team AS team_name,
        tools.tool_name,
        user_tools.access_level,   -- Fetching access_level
        user_tools.tool_owner      -- Fetching tool_owner
      FROM user_tools
      JOIN users ON user_tools.user_id = users.user_id
      JOIN tools ON user_tools.tool_id = tools.tool_id
      ORDER BY users.name, tools.tool_name;
`;
