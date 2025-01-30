import mysql from "mysql2/promise";
import { addUser, addUserTool } from "@/lib/queries";

export async function POST(req) {
  try {
    const { user, tool } = await req.json();

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert the user into the 'users' table with email_id
    const userId = await addUser(db, user.name, user.team, user.email_id);

    // Insert the user-tool relationship into the 'user_tools' table
    await addUserTool(db, userId, tool.tool_id, tool.access_level, tool.tool_owner, tool.ms_status);

    await db.end();

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
