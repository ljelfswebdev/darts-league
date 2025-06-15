'use client';

import { useState, useEffect } from 'react';
import { makePairings } from '@/lib/functions/makePairings';

export default function AttendancePage() {
  const [attendees, setAttendees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetch('/api/get-data')
      .then(res => res.json())
      .then(data => {
        const users = data.users || [];
        setAttendees(users);
        const init = {};
        users.forEach(u => (init[u._id.toString()] = false));
        setAttendance(init);
      });
  }, []);

  const toggle = id => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const generateFixtures = () => {
    const present = attendees.filter(u => attendance[u._id]);
    if (present.length < 2) {
      alert('Select at least 2 attendees.');
      return;
    }
    setFixtures(makePairings(present));
    setScores({});
  };

  const handleScoreChange = (key, side, value) => {
    setScores(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [side]: value }
    }));
  };

  const submitScores = async () => {
    const results = fixtures.map((f, i) => {
      const key = `${i}-${f.home._id}-${f.away._id}`;
      return {
        homeId: f.home._id,
        awayId: f.away._id,
        homeScore: parseInt(scores[key]?.home ?? '', 10),
        awayScore: parseInt(scores[key]?.away ?? '', 10)
      };
    });

    const res = await fetch('/api/submit-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results),
    });
    const json = await res.json();
    if (json.success) {
      alert('Scores submitted and stats updated!');
      setFixtures([]);
    } else {
      alert('Error: ' + json.error);
    }
  };

  return (
    <div>
      <h1>Mark Attendance</h1>
      <ul>
        {attendees.map(u => (
          <li key={u._id.toString()}>
            <label>
              <input
                type="checkbox"
                checked={!!attendance[u._id]}
                onChange={() => toggle(u._id)}
              />
              {u.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={generateFixtures}>Generate Fixtures</button>

      {fixtures.length > 0 && (
        <div>
          <h2>Generated Fixtures</h2>
          <ul>
            {fixtures.map((f, i) => {
              const key = `${i}-${f.home._id}-${f.away._id}`;
              return (
                <li key={key} style={{ marginBottom: '1rem' }}>
                  <strong>{f.home.name}</strong>{' '}
                  <input
                    type="number"
                    min="0"
                    placeholder="–"
                    value={scores[key]?.home ?? ''}
                    onChange={e => handleScoreChange(key, 'home', e.target.value)}
                    style={{ width: '3ch', margin: '0 0.5rem' }}
                  />
                  vs
                  <input
                    type="number"
                    min="0"
                    placeholder="–"
                    value={scores[key]?.away ?? ''}
                    onChange={e => handleScoreChange(key, 'away', e.target.value)}
                    style={{ width: '3ch', margin: '0 0.5rem' }}
                  />
                  <strong>{f.away.name}</strong>
                </li>
              );
            })}
          </ul>
          <button onClick={submitScores}>Submit Scores</button>
        </div>
      )}
    </div>
  );
}