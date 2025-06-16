'use client';

import { useState, useEffect } from 'react';
import { makePairings } from '@/lib/functions/makePairings';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/');
    }
  }, []);

  const [attendees, setAttendees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [fixtures, setFixtures] = useState([]);
  const [scores, setScores] = useState({});
  const [customHome, setCustomHome] = useState('');
  const [customAway, setCustomAway] = useState('');
  const [search, setSearch] = useState('');

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

  const deleteFixture = key => {
    setFixtures(prev =>
      prev.filter((_, i) => `${i}-${prev[i].home._id}-${prev[i].away._id}` !== key)
    );
    setScores(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const addCustomFixture = () => {
    if (!customHome || !customAway || customHome === customAway) {
      alert('Choose two different players.');
      return;
    }

    const home = attendees.find(u => u._id === customHome);
    const away = attendees.find(u => u._id === customAway);

    if (!home || !away) {
      alert('Invalid player selection.');
      return;
    }

    setFixtures(prev => [...prev, { home, away }]);
    setCustomHome('');
    setCustomAway('');
  };

  const handleScoreChange = (key, side, value) => {
    setScores(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [side]: value },
    }));
  };

  const submitSingleScore = async (key, fixture) => {
    const result = {
      homeId: fixture.home._id,
      awayId: fixture.away._id,
      homeScore: parseInt(scores[key]?.home ?? '', 10),
      awayScore: parseInt(scores[key]?.away ?? '', 10),
    };

    const res = await fetch('/api/submit-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([result]),
    });

    const json = await res.json();
    if (json.success) {
      alert('Score submitted!');
      deleteFixture(key);
    } else {
      alert('Error: ' + json.error);
    }
  };

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedAttendees = attendees.filter(u => attendance[u._id]);

  return (
    <div className="pt-10 pb-32">
      <div className="container">
      <h1 className="text-2xl font-semibold text-primary mb-4">Mark Attendance</h1>

      {/* Search & Attendee List */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 border border-gray rounded mb-3"
        />
        <div className="max-h-64 overflow-y-auto border border-gray rounded p-4 bg-white scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredAttendees.map(u => (
              <li key={u._id}>
                <label className="flex items-center gap-2 cursor-pointer">
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
        </div>
      </div>

      {/* Selected Players */}
      {selectedAttendees.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Selected Players:</h2>
          <div className="flex flex-wrap gap-2">
            {selectedAttendees.map(u => (
              <span
                key={u._id}
                className="bg-primary text-white px-3 py-1 rounded-full text-sm"
              >
                {u.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <button onClick={generateFixtures} className="button button--primary mb-8">
        Generate Fixtures
      </button>

      {/* Add Custom Fixture */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-primary mb-2">Add Custom Fixture</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={customHome}
            onChange={e => setCustomHome(e.target.value)}
            className="border border-gray rounded p-2"
          >
            <option value="">Select Home</option>
            {attendees.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <span className="text-sm">vs</span>
          <select
            value={customAway}
            onChange={e => setCustomAway(e.target.value)}
            className="border border-gray rounded p-2"
          >
            <option value="">Select Away</option>
            {attendees.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <button onClick={addCustomFixture} className="button button--secondary">
            Add
          </button>
        </div>
      </div>

      {/* Fixture List */}
      {fixtures.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-primary mb-4">Fixtures</h2>
          <ul className="space-y-4">
            {fixtures.map((f, i) => {
              const key = `${i}-${f.home._id}-${f.away._id}`;
              return (
                <li
                  key={key}
                  className="flex flex-wrap items-center gap-2 bg-gray/20 p-3 rounded"
                >
                  <strong>{f.home.name}</strong>
                  <input
                    type="number"
                    min="0"
                    placeholder="–"
                    value={scores[key]?.home ?? ''}
                    onChange={e => handleScoreChange(key, 'home', e.target.value)}
                    className="w-12 text-center border rounded"
                  />
                  <span className="font-medium">vs</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="–"
                    value={scores[key]?.away ?? ''}
                    onChange={e => handleScoreChange(key, 'away', e.target.value)}
                    className="w-12 text-center border rounded"
                  />
                  <strong>{f.away.name}</strong>
                  <button
                    onClick={() => submitSingleScore(key, f)}
                    className="button button--primary ml-auto"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => deleteFixture(key)}
                    className="button button--secondary"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}