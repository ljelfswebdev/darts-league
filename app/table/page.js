'use client';

import { useState, useEffect, useRef } from 'react';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    fetch('/api/standings')
      .then(res => res.json())
      .then(data => setStandings(data.standings || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
    }
  }, [standings]);

  if (standings.length === 0) {
    return <p className="text-center text-gray mt-10">No standings yet. Go play some games!</p>;
  }

  return (
    <div className="pt-10 pb-32">
      <div className="container">
      <h1 className="text-2xl font-semibold text-primary mb-4">League Standings</h1>

      <div className="relative">
        {/* Scroll shadow overlay */}
        {isScrollable && (
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent dark:from-black z-10" />
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200"
        >
          <div className="min-w-[700px] flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold uppercase text-primary border-b border-gray pb-2">
              <div className="w-8">#</div>
              <div className="flex-1">Name</div>
              <div className="w-12 text-center">P</div>
              <div className="w-8 text-center">W</div>
              <div className="w-8 text-center">L</div>
              <div className="w-16 text-center">For</div>
              <div className="w-16 text-center">Agst</div>
              <div className="w-12 text-center">Diff</div>
              <div className="w-16 text-center">Win %</div>
            </div>

            {standings.map((p, i) => (
              <div
                key={p.id}
                className="flex justify-between items-center py-2 px-2 bg-gray/20 rounded hover:bg-primary/10 transition"
              >
                <div className="w-8 font-bold text-black">{i + 1}</div>
                <div className="flex-1 text-black">{p.name}</div>
                <div className="w-12 text-center text-black">{p.played}</div>
                <div className="w-8 text-center text-black">{p.wins}</div>
                <div className="w-8 text-center text-black">{p.losses}</div>
                <div className="w-16 text-center text-black">{p.legsFor}</div>
                <div className="w-16 text-center text-black">{p.legsAgainst}</div>
                <div className="w-12 text-center text-black">
                  {p.diff >= 0 ? `+${p.diff}` : p.diff}
                </div>
                <div className="w-16 text-center text-black">{p.winRatio}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}