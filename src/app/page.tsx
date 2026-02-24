import PalmReader from '@/components/PalmReader';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full" style={{ width: '600px', height: '600px', top: '-200px', right: '-100px', background: 'radial-gradient(circle, var(--orb1) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', background: 'radial-gradient(circle, var(--orb2) 0%, transparent 70%)' }} />
        <div className="absolute rounded-full" style={{ width: '300px', height: '300px', top: '40%', left: '30%', background: 'radial-gradient(circle, var(--orb2) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            PalmAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5 text-sm" style={{ color: 'var(--text-muted)' }}>
            <a href="#how" className="hover:opacity-70 transition-opacity">How It Works</a>
            <a href="#features" className="hover:opacity-70 transition-opacity">Features</a>
            <a href="#read" className="btn-primary text-white px-4 py-2 rounded-lg font-medium text-sm">Get Reading</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-12 pb-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: 'var(--text-muted)' }}>
          <span>✨</span><span>AI-Powered Palm Reading</span><span>✨</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          <span style={{ color: 'var(--text)' }}>READ YOUR</span>
          <br />
          <span className="shimmer-text">FUTURE IN SECONDS</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Upload a photo of your palm and our AI will analyze your heart line, head line,
          life line, and fate line to reveal personalized insights.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm" style={{ color: 'var(--text-dim)' }}>
          {['No account needed', 'Images not stored', 'Instant results', 'For entertainment'].map(f => (
            <span key={f} className="flex items-center gap-1">
              <span style={{ color: '#a78bfa' }}>✓</span> {f}
            </span>
          ))}
        </div>
      </section>

      {/* Main Reader */}
      <section id="read" className="relative z-10 px-4 pb-12 max-w-4xl mx-auto">
        <div className="rounded-3xl p-6 md:p-8 card" style={{ boxShadow: '0 0 60px rgba(88,28,220,0.1)' }}>
          <PalmReader />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', emoji: '📸', title: 'Scan Your Palm', desc: 'Use your camera or upload a photo of your dominant hand with fingers spread, palm facing up.' },
            { step: '02', emoji: '🤖', title: 'AI Detects Lines', desc: 'MediaPipe maps your hand in real-time, then our AI reads your heart, life, fate, and head lines.' },
            { step: '03', emoji: '✨', title: 'Get Your Reading', desc: 'Receive 5 personalized sections: Love Life, Career Path, Life Energy, Hidden Talents & Lucky Period.' },
          ].map(({ step, emoji, title, desc }) => (
            <div key={step} className="rounded-2xl p-6 text-center card2">
              <div className="text-4xl mb-3">{emoji}</div>
              <div className="text-xs font-bold mb-2" style={{ color: '#7c3aed' }}>{step}</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-8 pb-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>What We Analyze</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '❤️', title: 'Love Life', desc: 'Heart & Relationships', color: '#f87171' },
            { emoji: '⭐', title: 'Career Path', desc: 'Destiny & Ambition', color: '#fbbf24' },
            { emoji: '🌿', title: 'Life Energy', desc: 'Vitality & Strength', color: '#4ade80' },
            { emoji: '🧠', title: 'Hidden Talents', desc: 'Intellect & Gifts', color: '#60a5fa' },
          ].map(({ emoji, title, desc, color }) => (
            <div key={title} className="rounded-2xl p-5 text-center card2" style={{ borderColor: `${color}33` }}>
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-semibold text-sm mb-1" style={{ color }}>{title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">🔮</span>
          <span className="font-bold" style={{ color: '#a78bfa' }}>PalmAI</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>© 2025 PalmAI. For entertainment purposes only.</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-dim)', opacity: 0.7 }}>We do not store your palm images.</p>
        <p className="text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
          Created by{' '}
          <a href="https://logicproviders.ca/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: '#a78bfa' }}>
            Logic Providers
          </a>
        </p>
      </footer>
    </div>
  );
}
