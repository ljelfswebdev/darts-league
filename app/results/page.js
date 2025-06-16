'use client';

import { useState, useEffect } from 'react';

const RESULTS_PER_PAGE = 15;

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/get-results')
      .then(res => res.json())
      .then(data => setResults(data.results || []))
      .catch(console.error);
  }, []);

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );

  if (results.length === 0) {
    return <p className="text-center text-gray mt-10">No match results available yet.</p>;
  }

  return (
    <div className="px-4 pt-10 pb-32">
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-primary">All Match Results</h1>
          {totalPages > 1 && (
            <select
              className="text-sm border border-gray rounded px-2 py-1 bg-white text-black"
              value={page}
              onChange={e => setPage(parseInt(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200">
          <div className="min-w-[600px] flex flex-col gap-2">
            <div className="flex justify-between text-sm font-bold uppercase text-primary border-b border-gray pb-2">
              <div className="w-40">Date</div>
              <div className="flex-1">Home</div>
              <div className="w-20 text-center">Score</div>
              <div className="flex-1 text-right">Away</div>
            </div>

            {paginatedResults.map((r, i) => (
              <div
                key={`${r.id}-${i}`}
                className="flex justify-between items-center py-2 px-2 bg-gray/20 rounded hover:bg-primary/10 transition text-black"
              >
                <div className="w-40 text-sm">
                  {new Date(r.playedAt).toLocaleString()}
                </div>
                <div className="flex-1">{r.home}</div>
                <div className="w-20 text-center font-medium">
                  {r.homeScore} – {r.awayScore}
                </div>
                <div className="flex-1 text-right">{r.away}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}