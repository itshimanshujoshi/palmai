'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
      style={{
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.08)',
        border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(139,92,246,0.2)',
        color: dark ? '#c4b5fd' : '#6d28d9',
      }}
      title="Toggle theme"
    >
      {dark ? '☀️' : '🌙'}
      <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
