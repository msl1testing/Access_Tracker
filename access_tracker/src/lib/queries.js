export const fetchUserTools = `
  SELECT u.name AS user_name, GROUP_CONCAT(t.tool_name SEPARATOR ', ') AS tools
FROM user_tools ut
JOIN users u ON ut.user_id = u.user_id
JOIN tools t ON ut.tool_id = t.tool_id
GROUP BY u.user_id;
`;
