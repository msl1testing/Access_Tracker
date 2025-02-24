import mysql from "mysql2/promise";
import { fetchClientTools } from "@/lib/queries";

export async function GET() {
  let db;

  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute(fetchClientTools);
    
    // Group data by clients
    const clientTools = {};
    rows.forEach(({ client, tool_name }) => {
      if (!clientTools[client]) {
        clientTools[client] = [];
      }
      clientTools[client].push(tool_name);
    });

    return new Response(JSON.stringify(clientTools), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Database query failed", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (db) await db.end();
  }
}
