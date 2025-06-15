import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const matches = await req.json(); // Array of match objects
    const client = await clientPromise;
    const db = client.db();
    const matchesCol = db.collection('matches');
    const usersCol = db.collection('users');

    const bulkUserOps = [];

    for (const m of matches) {
      const homeId = new ObjectId(m.homeId);
      const awayId = new ObjectId(m.awayId);
      const homeScore = m.homeScore;
      const awayScore = m.awayScore;

      const homeWon = homeScore > awayScore;
      const awayWon = awayScore > homeScore;

      await matchesCol.insertOne({
        homeId,
        awayId,
        homeScore,
        awayScore,
        playedAt: new Date(),
      });

      const stats = [
        {
          _id: homeId,
          win: homeWon ? 1 : 0,
          lose: awayWon ? 1 : 0,
          legsWin: homeScore,
          legsLost: awayScore,
          diff: homeScore - awayScore,
        },
        {
          _id: awayId,
          win: awayWon ? 1 : 0,
          lose: homeWon ? 1 : 0,
          legsWin: awayScore,
          legsLost: homeScore,
          diff: awayScore - homeScore,
        },
      ];

      stats.forEach(({ _id, win, lose, legsWin, legsLost, diff }) => {
        bulkUserOps.push({
          updateOne: {
            filter: { _id },
            update: {
              $inc: {
                wins: win,
                losses: lose,
                legsWins: legsWin,
                legsLost: legsLost,
                legsDiff: diff,
                gamesPlayed: 1,
              }
            }
          }
        });
      });
    }

    if (bulkUserOps.length) {
      await usersCol.bulkWrite(bulkUserOps);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error saving results:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}