import { cookies } from 'next/headers';

export async function POST() {
  cookies().set('isLoggedIn', '', {
    path: '/',
    maxAge: 0,
  });

  return Response.json({ success: true });
}