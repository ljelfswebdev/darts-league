import clientPromise from '@/lib/mongo';

export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name ) {
      return new Response(JSON.stringify({ success: false, error: 'Namerequired' }), { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users'); // or 'submissions' if you want

    const insertResult = await collection.insertOne({ name, createdAt: new Date() });

    return new Response(JSON.stringify({
      success: true,
      userId: insertResult.insertedId
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error submitting form:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}