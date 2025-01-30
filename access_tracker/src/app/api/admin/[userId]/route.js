import mysql from 'mysql2/promise';
import { deleteUser, deleteUserTools } from '@/lib/queries';

export async function DELETE(req, { params }) {
  const { userId } = params;  // Get the userId from the dynamic route parameters

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Delete related user_tools first (if necessary)
    await db.execute(deleteUserTools, [userId]);

    // Delete user from users table
    await db.execute(deleteUser, [userId]);

    await db.end();

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Error deleting user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
