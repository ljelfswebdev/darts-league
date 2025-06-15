import clientPromise from '@/lib/mongo';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find().toArray();

  const standings = users.map(u => {
    const played = u.gamesPlayed || 0;
    const wins = u.wins || 0;
    const losses = u.losses || 0;
    const legsFor = u.legsWins || 0;
    const legsAgainst = u.legsLost || 0;
    const diff = u.legsDiff || (legsFor - legsAgainst);
    const winRatio = played ? (wins / played) * 100 : 0;

    return {
      id: u._id.toString(),
      name: u.name,
      played,
      wins,
      losses,
      legsFor,
      legsAgainst,
      diff,
      winRatio: Math.round(winRatio),
    };
  });

  // Sort by win ratio, wins, diff, legsFor
  standings.sort((a, b) => {
    if (b.winRatio !== a.winRatio) return b.winRatio - a.winRatio;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.legsFor - a.legsFor;
  });

  return new Response(JSON.stringify({ standings }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}