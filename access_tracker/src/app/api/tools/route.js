import mysql from "mysql2/promise";
import { fetchClientTools, fetchToolClients } from "@/lib/queries";

export async function GET() {
  let db;

  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [clientRows] = await db.execute(fetchClientTools);
    const [toolRows] = await db.execute(fetchToolClients);

    // Format data for clients -> tools
    const clientTools = {};
    clientRows.forEach(({ client, tool_name }) => {
      if (!clientTools[client]) {
        clientTools[client] = [];
      }
      clientTools[client].push(tool_name);
    });

    // Format data for tools -> clients
    const toolClients = {};
    toolRows.forEach(({ tool_name, client }) => {
      if (!toolClients[tool_name]) {
        toolClients[tool_name] = [];
      }
      toolClients[tool_name].push(client);
    });

    return new Response(JSON.stringify({ clientTools, toolClients }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (db) await db.end();
  }
}


