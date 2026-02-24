'use client';

import { useEffect, useRef, useState } from 'react';

// Hand landmark connections (MediaPipe hand topology)
const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

interface Props {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
  dominantHand: 'left' | 'right';
}

export default function CameraWithDetection({ onCapture, onCancel, dominantHand }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  const [handDetected, setHandDetected] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const startCamera = async (facing: 'environment' | 'user') => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.error('Camera error:', e);
    }
  };

  const drawHand = (landmarks: { x: number; y: number; z: number }[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Skeleton
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.55)';
    ctx.lineWidth = 1.5;
    CONNECTIONS.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h);
      ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h);
      ctx.stroke();
    });

    // Heart line (gold) — pinky MCP → ring → middle → index MCP
    ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    [17, 13, 9, 5].forEach((idx, i) => {
      const p = landmarks[idx];
      i === 0 ? ctx.moveTo(p.x * w, p.y * h) : ctx.lineTo(p.x * w, p.y * h);
    });
    ctx.stroke();

    // Life line (green) — index MCP → thumb base → wrist (quadratic curve)
    ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(landmarks[5].x * w, landmarks[5].y * h);
    ctx.quadraticCurveTo(landmarks[1].x * w, landmarks[1].y * h, landmarks[0].x * w, landmarks[0].y * h);
    ctx.stroke();

    // Fate line (blue) — wrist → middle finger MCP
    ctx.shadowColor = 'rgba(96, 165, 250, 0.9)';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(landmarks[0].x * w, landmarks[0].y * h);
    ctx.lineTo(landmarks[9].x * w, landmarks[9].y * h);
    ctx.stroke();

    // Landmark dots
    ctx.shadowColor = 'rgba(168, 85, 247, 1)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#c4b5fd';
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * w, lm.y * h, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  useEffect(() => {
    cancelledRef.current = false;

    const loop = () => {
      if (cancelledRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const lm = landmarkerRef.current;

      if (video && canvas && lm && video.readyState >= 2 && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        try {
          const res = lm.detectForVideo(video, performance.now());
          if (res.landmarks?.length > 0) {
            setHandDetected(true);
            drawHand(res.landmarks[0], canvas);
          } else {
            setHandDetected(false);
            canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
          }
        } catch {
          // skip frame
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const init = async () => {
      await startCamera('environment');
      if (cancelledRef.current) return;
      try {
        const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        if (cancelledRef.current) return;
        const hl = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
        if (cancelledRef.current) { hl.close(); return; }
        landmarkerRef.current = hl;
      } catch (e) {
        console.error('MediaPipe init error:', e);
        // camera still works without detection
      }
      setScannerReady(true);
      loop();
    };

    init();

    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(rafRef.current);
      landmarkerRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const switchCamera = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext('2d')!.drawImage(video, 0, 0);
    onCapture(c.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="space-y-4">
      {/* Camera + overlay */}
      <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Loading overlay */}
        {!scannerReady && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            <div className="text-center space-y-3">
              <div className="text-5xl float-animation">🔮</div>
              <p className="text-purple-300 text-sm font-medium">Initializing palm scanner...</p>
              <p className="text-purple-500 text-xs">Loading AI vision model</p>
            </div>
          </div>
        )}

        {/* Status badge */}
        {scannerReady && (
          <div className="absolute top-3 inset-x-0 flex justify-center">
            <div
              className="px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
              style={{
                background: handDetected ? 'rgba(74,222,128,0.2)' : 'rgba(0,0,0,0.55)',
                border: `1px solid ${handDetected ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.12)'}`,
                color: handDetected ? '#4ade80' : '#9ca3af',
                transition: 'all 0.4s ease',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: handDetected ? '#4ade80' : '#6b7280' }}
              />
              {handDetected ? '✓ Palm detected — lines mapped!' : 'Show your palm to the camera'}
            </div>
          </div>
        )}

        {/* Guide frame when no hand */}
        {!handDetected && scannerReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              style={{
                width: '55%',
                height: '70%',
                border: '2px dashed rgba(139,92,246,0.5)',
                borderRadius: '16px',
              }}
            />
          </div>
        )}

        {/* Palm line legend */}
        {handDetected && (
          <div
            className="absolute bottom-3 left-3 space-y-1 p-2 rounded-lg text-xs"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          >
            {[
              ['#fbbf24', 'Heart Line'],
              ['#4ade80', 'Life Line'],
              ['#60a5fa', 'Fate Line'],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-4 h-0.5 rounded inline-block" style={{ background: color }} />
                <span style={{ color }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-none py-3 px-5 rounded-xl font-medium transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#a78bfa',
          }}
        >
          ✕
        </button>
        <button
          onClick={capture}
          className="flex-1 py-3 rounded-xl font-semibold text-white btn-primary"
        >
          {handDetected ? '📸 Capture & Read Palm' : '📸 Capture Anyway'}
        </button>
        <button
          onClick={switchCamera}
          title="Switch camera"
          className="flex-none py-3 px-5 rounded-xl font-medium transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#a78bfa',
          }}
        >
          🔄
        </button>
      </div>

      <p className="text-center text-purple-500 text-xs">
        Hold your <span className="text-purple-300 font-medium">{dominantHand}</span> palm open,
        facing the camera with fingers slightly spread
      </p>
    </div>
  );
}
