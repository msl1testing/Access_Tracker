import mysql from "mysql2/promise";
import { addUser, addUserTool } from "@/lib/queries";  // Assuming the queries are imported here

export async function POST(req) {
  try {
    // Parse the request body
    const { user, tool } = await req.json();

    // Establish database connection
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert the user into the 'users' table
    const userId = await addUser(db, user.name, user.team);

    // Insert the user-tool relationship into the 'user_tools' table
    await addUserTool(db, userId, tool.tool_id, tool.access_level, tool.tool_owner, tool.ms_status);

    // Close the database connection
    await db.end();

    // Return success response
    return new Response(
      JSON.stringify({ message: "Entry added successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ error: "Database query failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
