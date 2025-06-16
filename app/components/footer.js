'use client';

import { useEffect, useState } from 'react';

const Footer = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    setLoggedIn(isLogged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    alert('Logged out!');
    window.location.reload();
  };

  return (
    <footer className="w-screen py-4 bg-primary fixed bottom-0 left-0 z-50">
      <div className="container px-4 flex justify-between items-center text-white">
        <div>Brewood Darts League</div>
        {loggedIn && (
          <button
            onClick={handleLogout}
            className="text-sm underline hover:text-gray-200 transition"
          >
            Logout
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;