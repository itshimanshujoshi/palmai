'use client';
import { useEffect, useState } from 'react';

const STAGES = [
  { text: 'Scanning palm lines...', icon: '🔍', color: '#c4b5fd' },
  { text: 'Reading your heart line...', icon: '❤️', color: '#f87171' },
  { text: 'Tracing your life path...', icon: '🌿', color: '#4ade80' },
  { text: 'Channeling your destiny...', icon: '⭐', color: '#fbbf24' },
  { text: 'Revealing hidden truths...', icon: '✨', color: '#a78bfa' },
];

const LINES = [
  { label: 'Heart Line', color: '#f87171' },
  { label: 'Life Line', color: '#4ade80' },
  { label: 'Fate Line', color: '#60a5fa' },
  { label: 'Head Line', color: '#fbbf24' },
];

export default function ReadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanned, setScanned] = useState<number[]>([]);

  useEffect(() => {
    const D = 3200;
    const si = setInterval(() => setStage(p => Math.min(p + 1, STAGES.length - 1)), D / STAGES.length);
    const pi = setInterval(() => setProgress(p => Math.min(p + 2, 100)), D / 50);
    LINES.forEach((_, i) => setTimeout(() => setScanned(p => [...p, i]), i * 700 + 300));
    const t = setTimeout(onComplete, D + 200);
    return () => { clearInterval(si); clearInterval(pi); clearTimeout(t); };
  }, [onComplete]);

  const s = STAGES[stage];
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <div className="absolute inset-0 rounded-full" style={{ border: '2px solid transparent', background: 'linear-gradient(#0a0a0f,#0a0a0f) padding-box, linear-gradient(90deg,#7c3aed,#a855f7,#c084fc,#7c3aed) border-box', animation: 'spin-slow 3s linear infinite' }} />
        <div className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.3) 0%,transparent 70%)', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
        <span className="text-5xl relative z-10 float-animation">🤚</span>
      </div>

      <div className="text-center min-h-16">
        <div className="text-3xl mb-1">{s.icon}</div>
        <p className="text-lg font-semibold" style={{ color: s.color }}>{s.text}</p>
        <p className="text-purple-500 text-sm mt-1">The ancient wisdom is speaking...</p>
      </div>

      <div className="w-60 space-y-2">
        {LINES.map((l, i) => (
          <div key={l.label} className="flex items-center gap-2">
            <span className="text-xs w-20 text-right" style={{ color: l.color }}>{l.label}</span>
            <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-1 rounded-full" style={{ width: scanned.includes(i) ? '100%' : '0%', background: l.color, boxShadow: scanned.includes(i) ? `0 0 8px ${l.color}` : 'none', transition: 'width 0.8s ease' }} />
            </div>
            <span className="text-xs w-4" style={{ color: scanned.includes(i) ? '#4ade80' : '#374151' }}>{scanned.includes(i) ? '✓' : '○'}</span>
          </div>
        ))}
      </div>

      <div className="w-60">
        <div className="h-1 rounded-full" style={{ background: 'rgba(139,92,246,0.15)' }}>
          <div className="h-1 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)', boxShadow: '0 0 10px rgba(168,85,247,0.8)', transition: 'width 0.1s linear' }} />
        </div>
        <p className="text-center text-purple-600 text-xs mt-1">{Math.round(progress)}% complete</p>
      </div>

      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background: '#a855f7', animation: `bounce-dot 0.7s ease-in-out ${i*0.15}s infinite alternate` }} />
        ))}
      </div>
    </div>
  );
}
