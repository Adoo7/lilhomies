import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows, fields } = await sql`select * from lilhomies_burns`
    return NextResponse.json({ rows, fields });
  } catch (error) {
    console.log('error: ', error)
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, phrase } = await request.json();

    // Validate the input
    if (!user_id || !phrase) {
      return NextResponse.json({ error: 'user_id and phrase are required' }, { status: 400 });
    }

    const query = `INSERT INTO lilhomies_burns (user_id, phrase) VALUES ($1, $2)`;
    await sql.query(query, [user_id, phrase]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    return NextResponse.error();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Assuming the client sends the id in the request body

    // Validate the id
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Run the DELETE query
    const query = `DELETE FROM lilhomies_burns WHERE user_id = $1`;
    await sql.query(query, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    return NextResponse.error();
  }
}