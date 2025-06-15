'use client';

import { useState, useEffect } from 'react';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/api/get-results')
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(console.error);
  }, []);

  if (results.length === 0) {
    return <p>No match results available yet.</p>;
  }

  return (
    <div>
      <h1>All Match Results</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Home</th>
            <th>Score</th>
            <th>Away</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.playedAt).toLocaleString()}</td>
              <td>{r.home}</td>
              <td>{r.homeScore} – {r.awayScore}</td>
              <td>{r.away}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}