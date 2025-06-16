import clientPromise from '@/lib/mongo';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const master = db.collection('master');

    const user = await master.findOne({ email });
    if (!user) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return Response.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }


    return Response.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}