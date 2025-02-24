import mysql from "mysql2/promise";

export async function GET(req, context) {
  const params = await context.params; // ✅ Await params
  const userId = params?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [userId]);
  await db.end();

  return new Response(JSON.stringify(rows[0] || {}), { status: 200 });
}

// ✅ Fixed PUT request handler
export async function PUT(req, context) {
    const params = context.params;
    const userId = params?.userId;
  
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }
  
    try {
      const body = await req.json();
      const { name, team, email_id } = body; // ✅ Ensure `team` is included
  
      if (!name || !team || !email_id) {
        return new Response(JSON.stringify({ error: "Name, team, and email are required" }), { status: 400 });
      }
  
      const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
  
      const [result] = await db.execute(
        "UPDATE users SET name = ?, team = ?, email_id = ? WHERE user_id = ?",
        [name, team, email_id, userId] // ✅ Include `team` in the update query
      );
  
      await db.end();
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ error: "User not found or no changes made" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
