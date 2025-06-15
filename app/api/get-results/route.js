import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const matches = await db.collection('matches')
      .find()
      .sort({ playedAt: -1 })
      .toArray();

    const ids = Array.from(
      new Set(matches.flatMap(m => [m.homeId, m.awayId]))
    );
    const objectIds = ids.map(id => new ObjectId(id));
    const users = await db.collection('users')
      .find({ _id: { $in: objectIds } })
      .toArray();

    const userMap = Object.fromEntries(
      users.map(u => [u._id.toString(), u.name])
    );

    const results = matches.map(m => ({
      id: m._id.toString(),
      home: userMap[m.homeId] || 'Unknown',
      away: userMap[m.awayId] || 'Unknown',
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      playedAt: m.playedAt
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}