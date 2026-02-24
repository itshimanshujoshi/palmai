'use client';
import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ReadingAnimation from './ReadingAnimation';
import PalmReading from './PalmReading';

const CameraWithDetection = dynamic(() => import('./CameraWithDetection'), { ssr: false });

type State = 'idle' | 'camera' | 'processing' | 'results';

interface Reading {
  overview: string;
  loveLife: { description: string; insight: string };
  careerPath: { description: string; insight: string };
  lifeEnergy: { description: string; insight: string };
  hiddenTalents: { description: string; insight: string };
  luckyPeriod: { description: string; insight: string };
  luckyNumbers: string[];
  luckyColors: string[];
  affirmation: string;
  disclaimer: string;
}

export default function PalmReader() {
  const [state, setState] = useState<State>('idle');
  const [hand, setHand] = useState<'left' | 'right'>('right');
  const [image, setImage] = useState<string | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCapture = (dataUrl: string) => {
    setImage(dataUrl);
    setError(null);
    setState('processing');
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setError(null);
      setState('processing');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0]; if (file) processFile(file);
  }, []);

  const analyzePalm = async () => {
    if (!image) return;
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const mediaType = 'image/jpeg';
      const res = await fetch('/api/palm-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType, dominantHand: hand }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setReading(data.reading);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setState('idle');
    }
  };

  const reset = () => { setImage(null); setReading(null); setError(null); setState('idle'); };

  if (state === 'camera') {
    return <CameraWithDetection onCapture={processCapture} onCancel={() => setState('idle')} dominantHand={hand} />;
  }

  if (state === 'processing') {
    return <ReadingAnimation onComplete={analyzePalm} />;
  }

  if (state === 'results' && reading) {
    return <PalmReading reading={reading} palmImage={image!} onReset={reset} />;
  }

  // Idle state
  return (
    <div className="space-y-6">
      {/* Dominant hand selector */}
      <div className="text-center space-y-2">
        <p className="text-purple-300 text-sm font-medium">Which is your dominant hand?</p>
        <div className="inline-flex rounded-xl p-1" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          {(['left', 'right'] as const).map(h => (
            <button key={h} onClick={() => setHand(h)}
              className="px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize"
              style={hand === h
                ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 0 15px rgba(139,92,246,0.4)' }
                : { color: '#a78bfa' }}>
              {h === 'left' ? '🤚 Left' : 'Right 🖐️'}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`upload-zone rounded-2xl p-10 text-center ${isDragging ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
        <div className="space-y-4">
          <div className="text-6xl">🤚</div>
          <div>
            <p className="text-purple-200 text-lg font-medium">Drop your palm photo here</p>
            <p className="text-purple-500 text-sm mt-1">or use the buttons below</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Well-lit', 'Dominant hand', 'Palm up', 'Fingers spread'].map(tip => (
              <span key={tip} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.25)' }}>✓ {tip}</span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-center text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setState('camera')} className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white btn-primary">
          📷 Scan Palm
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="py-4 rounded-xl font-medium flex items-center justify-center gap-2"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a78bfa' }}>
          🖼️ Upload Photo
        </button>
      </div>
    </div>
  );
}
