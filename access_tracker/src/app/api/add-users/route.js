import mysql from "mysql2/promise";
import { addUser } from "@/lib/queries";

export async function POST(req) {
  let db;

  try {
    const { user } = await req.json();

    // Validate input
    if (!user?.name || !user?.team || !user?.email_id) {
      return new Response(
        JSON.stringify({ error: "Missing required user fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert user and retrieve their ID
    const userId = await addUser(db, user.name, user.team, user.email_id);
    console.log("New User ID:", userId);

    return new Response(
      JSON.stringify({ message: "User added successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ error: "Database query failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (db) {
      await db.end();
    }
  }
}
