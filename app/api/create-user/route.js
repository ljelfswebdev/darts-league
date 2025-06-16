import clientPromise from '@/lib/mongo';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password, isMaster } = await req.json();

    if (!email || !password) {
      return Response.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const master = db.collection('master');

    const existing = await master.findOne({ email });
    if (existing) {
      return Response.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await master.insertOne({
      email,
      passwordHash,
      isMaster: !!isMaster,
      createdAt: new Date(),
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('User creation error:', err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}