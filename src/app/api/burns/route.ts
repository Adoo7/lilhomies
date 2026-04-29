import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows, fields } = await sql` SELECT * FROM lilhomies_burns
                                        ORDER BY 
                                            CASE 
                                                WHEN POSITION('-----' IN phrase) > 0 THEN 0
                                                ELSE 1
                                            END,
                                            POSITION('-----' IN phrase)`
    return NextResponse.json({ rows, fields });
  } catch (error) {
    console.log('error: ', error)
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id } = body;

    // Support both single phrase and bulk phrases array
    const phrases: string[] = Array.isArray(body.phrases)
      ? body.phrases
      : body.phrase
        ? [body.phrase]
        : [];

    if (!user_id || phrases.length === 0) {
      return NextResponse.json({ error: 'user_id and phrase(s) are required' }, { status: 400 });
    }

    for (const phrase of phrases) {
      if (phrase.trim()) {
        await sql.query(
          `INSERT INTO lilhomies_burns (user_id, phrase) VALUES ($1, $2)`,
          [user_id, phrase.trim()]
        );
      }
    }

    return NextResponse.json({ success: true, inserted: phrases.filter(p => p.trim()).length });
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