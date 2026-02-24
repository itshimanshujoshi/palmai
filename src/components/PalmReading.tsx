'use client';
import { useEffect, useState } from 'react';

interface Section { description: string; insight: string; }
interface Reading {
  overview: string;
  loveLife: Section; careerPath: Section; lifeEnergy: Section;
  hiddenTalents: Section; luckyPeriod: Section;
  luckyNumbers: string[]; luckyColors: string[];
  affirmation: string;
}
interface Props { reading: Reading; palmImage: string; onReset: () => void; }

const SECTIONS = [
  { key: 'loveLife', label: 'Love Life', emoji: '❤️', color: '#f87171', glow: 'rgba(248,113,113,0.25)', desc: 'Heart & Relationships' },
  { key: 'careerPath', label: 'Career Path', emoji: '⭐', color: '#fbbf24', glow: 'rgba(251,191,36,0.25)', desc: 'Destiny & Ambition' },
  { key: 'lifeEnergy', label: 'Life Energy', emoji: '🌿', color: '#4ade80', glow: 'rgba(74,222,128,0.25)', desc: 'Vitality & Strength' },
  { key: 'hiddenTalents', label: 'Hidden Talents', emoji: '🧠', color: '#60a5fa', glow: 'rgba(96,165,250,0.25)', desc: 'Intellect & Gifts' },
  { key: 'luckyPeriod', label: 'Lucky Period', emoji: '🔮', color: '#c084fc', glow: 'rgba(192,132,252,0.25)', desc: 'Timing & Fortune' },
] as const;

export default function PalmReading({ reading, palmImage, onReset }: Props) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    SECTIONS.forEach((_, i) => setTimeout(() => setVisible(i + 1), i * 700 + 400));
  }, []);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="shimmer-text text-2xl font-bold">✨ Your Palm Reading ✨</div>
        <p className="text-purple-400 text-sm mt-1">Ancient wisdom meets modern AI</p>
      </div>

      <div className="rounded-2xl p-5 reading-card flex flex-col md:flex-row gap-5 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={palmImage} alt="palm" className="w-36 h-36 object-cover rounded-xl flex-shrink-0"
          style={{ boxShadow: '0 0 30px rgba(139,92,246,0.5)' }} />
        <p className="text-purple-100 leading-relaxed italic text-lg">&ldquo;{reading.overview}&rdquo;</p>
      </div>

      {SECTIONS.map(({ key, label, emoji, color, glow, desc }, i) => {
        const data = reading[key];
        const show = i < visible;
        return (
          <div key={key} className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(15,10,30,0.85)',
              border: `1px solid ${color}33`,
              boxShadow: show ? `0 0 20px ${glow}` : 'none',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.6s ease',
            }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <div>
                <div className="font-semibold" style={{ color }}>{label}</div>
                <div className="text-xs text-purple-500">{desc}</div>
              </div>
              {show && <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color, border: `1px solid ${color}44` }}>Revealed</span>}
            </div>
            {data?.description && <p className="text-purple-100 text-sm leading-relaxed">{data.description}</p>}
            {data?.insight && (
              <div className="rounded-lg p-3 text-sm italic" style={{ background: `${color}0f`, borderLeft: `3px solid ${color}`, color: '#e9d5ff' }}>
                💫 {data.insight}
              </div>
            )}
          </div>
        );
      })}

      {visible >= SECTIONS.length && (
        <>
          {(reading.luckyNumbers?.length > 0 || reading.luckyColors?.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {reading.luckyNumbers?.length > 0 && (
                <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <div className="text-2xl mb-2">🍀</div>
                  <div className="text-xs text-purple-400 mb-2">Lucky Numbers</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {reading.luckyNumbers.map(n => (
                      <span key={n} className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }}>{n}</span>
                    ))}
                  </div>
                </div>
              )}
              {reading.luckyColors?.length > 0 && (
                <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-xs text-purple-400 mb-2">Lucky Colors</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {reading.luckyColors.map(c => (
                      <span key={c} className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(196,181,253,0.1)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,0.3)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {reading.affirmation && (
            <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(168,85,247,0.1))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 30px rgba(139,92,246,0.2)' }}>
              <div className="text-3xl mb-3">🌟</div>
              <p className="text-purple-100 text-lg italic font-medium">&ldquo;{reading.affirmation}&rdquo;</p>
            </div>
          )}
        </>
      )}


      <button onClick={onReset} className="w-full py-4 rounded-xl font-semibold text-white btn-primary text-lg">🤚 Read Another Palm</button>
    </div>
  );
}
