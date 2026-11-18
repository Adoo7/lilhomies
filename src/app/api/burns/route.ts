import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres';

interface BurnPhrase {
  phrase: string;
  year: number | null;
}

function parsePhraseEntry(entry: unknown): BurnPhrase | null {
  if (typeof entry === 'string') return { phrase: entry, year: null };
  if (!entry || typeof entry !== 'object') return null;

  const { phrase, year } = entry as Record<string, unknown>;
  if (
    typeof phrase !== 'string' ||
    (year !== undefined && year !== null &&
      (typeof year !== 'number' || !Number.isInteger(year) || year < 1 || year > 9999))
  ) {
    return null;
  }

  return { phrase, year: typeof year === 'number' ? year : null };
}

export async function GET() {
  try {
    const { rows, fields } = await sql` SELECT * FROM lilhomies_burns
                                        ORDER BY 
                                            year DESC NULLS LAST,
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
    const rawPhrases: unknown[] = Array.isArray(body.phrases)
      ? body.phrases
      : body.phrase
        ? [{ phrase: body.phrase, year: body.year ?? null }]
        : [];
    const parsedPhrases = rawPhrases.map(parsePhraseEntry);

    if (!user_id || parsedPhrases.length === 0) {
      return NextResponse.json({ error: 'user_id and phrase(s) are required' }, { status: 400 });
    }
    if (parsedPhrases.some((phrase) => phrase === null)) {
      return NextResponse.json({ error: 'Each phrase must have a valid year' }, { status: 400 });
    }

    const phrases = parsedPhrases.filter((phrase): phrase is BurnPhrase => phrase !== null);
    for (const { phrase, year } of phrases) {
      if (phrase.trim()) {
        await sql.query(
          `INSERT INTO lilhomies_burns (user_id, phrase, year) VALUES ($1, $2, $3)`,
          [user_id, phrase.trim(), year]
        );
      }
    }

    return NextResponse.json({ success: true, inserted: phrases.filter(p => p.phrase.trim()).length });
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