import mysql from "mysql2/promise";

export async function GET(req, context) {
  const params = await context.params;
  const userId = params?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const query = `
      SELECT 
        tools.tool_id,
        tools.tool_name,
        user_tools.access_level,
        user_tools.client,
        user_tools.ms_status,
        user_tools.access_group
      FROM user_tools
      JOIN tools ON user_tools.tool_id = tools.tool_id
      WHERE user_tools.user_id = ?;
    `;

    const [rows] = await db.execute(query, [userId]);
    await db.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ ADD `POST` METHOD TO ADD A NEW TOOL ENTRY FOR A USER
export async function POST(req, context) {
  const params = await context.params;
  const userId = params?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { tool_id, access_level, client, ms_status, access_group } = body;

    if (!tool_id || !access_level || !client || !ms_status || !access_group) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await db.execute(
      `INSERT INTO user_tools (user_id, tool_id, access_level, client, ms_status, access_group) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, tool_id, access_level, client, ms_status, access_group]
    );

    await db.end();

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Failed to add tool entry" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Tool entry added successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding tool entry:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  const userId = params?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  try {
    const body = await req.json();
    const { tool_id, access_level, client, ms_status, access_group } = body;

    if (!tool_id || !access_level || !client || !ms_status || !access_group) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await db.execute(
      `UPDATE user_tools 
       SET access_level = ?, client = ?, ms_status = ?, access_group = ? 
       WHERE user_id = ? AND tool_id = ?`,
      [access_level, client, ms_status, access_group, userId, tool_id]
    );

    await db.end();

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "No matching entry found or no changes made" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User-tool entry updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating user-tool entry:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

