// lib/functions/makePairings.js
export function makePairings(players) {
    const pairings = [];
    const gamesCount = {};
    const seenPairs = new Set();
  
    const recordGame = (a, b) => {
      pairings.push({ home: a, away: b });
      gamesCount[a._id] = (gamesCount[a._id] || 0) + 1;
      gamesCount[b._id] = (gamesCount[b._id] || 0) + 1;
      seenPairs.add([a._id, b._id].sort().join('|'));
    };
  
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
  
    const hasPlayed = (a, b) => 
      seenPairs.has([a._id, b._id].sort().join('|'));
  
    // Ensure at least 2 rounds
    for (let round = 0; round < 2; round++) {
      const pool = shuffle([...players]);
      while (pool.length > 1) {
        const a = pool.pop();
        let opponentIndex = pool.findIndex(b => !hasPlayed(a, b));
        if (opponentIndex === -1) {
          opponentIndex = pool.length - 1;
        }
        const b = pool.splice(opponentIndex, 1)[0];
        recordGame(a, b);
      }
  
      // If odd, give extra game in the first round
      if (pool.length === 1) {
        const odd = pool.pop();
        const opponent = shuffle(players).find(p => p._id !== odd._id);
        recordGame(odd, opponent);
      }
    }
  
    return shuffle(pairings);
  }