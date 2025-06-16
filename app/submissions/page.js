'use client';

import { useEffect, useState } from 'react';

export default function SubmissionsPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/get-data')
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Submissions</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}