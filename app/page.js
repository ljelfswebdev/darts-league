'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function HomePage() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    setLoggedIn(isLogged);
  }, []);


  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    isMaster: false,
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleCreateSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    });

    const data = await res.json();
    if (data.success) {
      alert('Master created!');
      setCreateForm({ email: '', password: '', isMaster: false });
    } else {
      alert('Error: ' + data.error);
    }
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });
  
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      alert('Logged in!');
      window.location.reload(); // Or redirect
    } else {
      alert('Login failed: ' + data.error);
    }
  };

  return (
    <div className="pt-10 pb-32 bg-white text-black">
      <div className="container max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-8">
          Brewood Darts League
        </h1>

        <div className="relative w-full max-w-md mx-auto aspect-[3/2] overflow-hidden rounded-2xl shadow-lg mb-12">
          <Image
            src="/littler.jpg"
            alt="Brewood Darts League Hero"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {!loggedIn && (
    
        <form
          onSubmit={handleLoginSubmit}
          className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow border border-gray mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-primary">Master Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            required
            className="w-full mb-3 p-2 border border-gray rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            required
            className="w-full mb-4 p-2 border border-gray rounded"
          />
          <button type="submit" className="button button--primary w-full">
            Login
          </button>
        </form>

        )}
        {/* Hidden Create Master User Form (for dev/admin use) */}
        <form
          onSubmit={handleCreateSubmit}
          className="hidden max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow border border-gray"
        >
          <h2 className="text-xl font-semibold mb-4 text-primary">Create User (Admin Only)</h2>

          <input
            type="email"
            placeholder="Email"
            value={createForm.email}
            onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
            required
            className="w-full mb-3 p-2 border border-gray rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={createForm.password}
            onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
            required
            className="w-full mb-3 p-2 border border-gray rounded"
          />
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={createForm.isMaster}
              onChange={e => setCreateForm({ ...createForm, isMaster: e.target.checked })}
            />
            Grant master access
          </label>

          <button type="submit" className="button button--primary w-full">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}