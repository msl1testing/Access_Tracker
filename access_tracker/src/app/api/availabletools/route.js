import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET() {
  try {
    // Create a database connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Fetch available tools from the database
    const [rows] = await connection.execute('SELECT tool_id, tool_name FROM tools'); 
    
    // Close the connection
    await connection.end();

    // Return tools as JSON response
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching available tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
