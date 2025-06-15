'use client';

import { useState, useEffect } from 'react';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetch('/api/standings')
      .then(res => res.json())
      .then(data => setStandings(data.standings || []))
      .catch(console.error);
  }, []);

  if (standings.length === 0) {
    return <p>No standings yet. Go play some games!</p>;
  }

  return (
    <div>
      <h1>League Standings</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Played</th>
            <th>W</th>
            <th>L</th>
            <th>Legs For</th>
            <th>Legs Against</th>
            <th>Diff</th>
            <th>Win %</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.played}</td>
              <td>{p.wins}</td>
              <td>{p.losses}</td>
              <td>{p.legsFor}</td>
              <td>{p.legsAgainst}</td>
              <td>{p.diff >= 0 ? `+${p.diff}` : p.diff}</td>
              <td>{p.winRatio}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}