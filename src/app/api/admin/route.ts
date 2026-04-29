import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'hassan_is_gay';
const SESSION_COOKIE = 'admin_session';
// A simple fixed session token derived from the password.
// In production this should be a signed JWT or a random secret stored in env.
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? 'lh_admin_session_v1';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const authenticated = cookie.includes(`${SESSION_COOKIE}=${SESSION_TOKEN}`);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
