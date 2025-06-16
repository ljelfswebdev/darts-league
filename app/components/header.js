'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(logged);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    isLoggedIn && { label: 'Fixtures', href: '/fixtures' }, // hide if not logged in
    { label: 'Results', href: '/results' },
    { label: 'Table', href: '/table' },
  ].filter(Boolean); // remove false/null entries

  return (
    <header className="bg-primary text-white relative z-50">
      <div className="container">
        <div className="bg-primary relative z-[1] mx-auto px-4 py-4 flex items-center justify-between">
          <h5 className="text-xl font-semibold">Brewood Darts League</h5>
          <nav className="hidden md:flex gap-6">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`absolute h-screen top-0 left-0 w-full bg-primary text-white flex flex-col items-center justify-center gap-8 px-4 transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-screen py-12' : 'max-h-0'
        } md:hidden`}
      >
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;