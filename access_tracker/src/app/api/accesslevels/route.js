import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET method to fetch access levels based on tool_id
export async function GET(req) {
  try {
    // Extract tool_id from query params
    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get('tool_id');

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    // Create a database connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Fetch distinct access levels for the given tool_id
    const [rows] = await connection.execute(
      'SELECT DISTINCT access_level FROM user_tools WHERE tool_id = ?',
      [toolId]
    );

    // Close the connection
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching access levels:', error);
    return NextResponse.json({ error: 'Failed to fetch access levels' }, { status: 500 });
  }
}
