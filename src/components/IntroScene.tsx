import React, { useState, useEffect, useRef } from 'react';

interface IntroSceneProps {
  onComplete: () => void;
}

const IntroScene: React.FC<IntroSceneProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'black' | 'heart-appear' | 'beating' | 'expanding' | 'red-screen' | 'gradient' | 'particles'>('black');
  const [beatIndex, setBeatIndex] = useState(0);
  const [heartScale, setHeartScale] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [squeeze, setSqueeze] = useState({ x: 1, y: 1 });
  const [glowIntensity, setGlowIntensity] = useState(15);

  // Humanized beat timings (irregular like a real heart: tum-TUM...pause)
  const beatTimings = [650, 280, 850, 300, 780, 320, 700, 350];
  const scales = [0, 0.75, 0.85, 1.0, 1.1, 1.3, 1.5, 1.8, 2.3];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('heart-appear'), 1000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === 'heart-appear') {
      const t = setTimeout(() => {
        setHeartScale(0.75);
        setPhase('beating');
        setBeatIndex(1);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Organic squeeze during beats
  const doBeat = (index: number, isStrong: boolean) => {
    // Squeeze effect: compress horizontally, expand vertically on beat
    const squeezeAmount = isStrong ? 0.12 : 0.07;
    setSqueeze({ x: 1 - squeezeAmount, y: 1 + squeezeAmount * 0.8 });
    setGlowIntensity(isStrong ? 40 : 25);
    
    setTimeout(() => {
      setSqueeze({ x: 1 + squeezeAmount * 0.3, y: 1 - squeezeAmount * 0.3 });
      setGlowIntensity(15);
    }, 120);
    
    setTimeout(() => {
      setSqueeze({ x: 1, y: 1 });
    }, 250);

    setHeartScale(scales[index] ?? scales[scales.length - 1]);
  };

  useEffect(() => {
    if (phase !== 'beating') return;
    if (beatIndex === 0) return;

    if (beatIndex <= 8) {
      const isStrong = beatIndex % 2 === 0; // Every second beat is stronger (tum-TUM)
      doBeat(beatIndex, isStrong);

      const timing = beatTimings[(beatIndex - 1) % beatTimings.length];
      const jitter = (Math.random() - 0.5) * 80; // Irregular timing

      const t = setTimeout(() => {
        if (beatIndex < 8) {
          setBeatIndex(beatIndex + 1);
        } else {
          setTimeout(() => setPhase('expanding'), 300);
        }
      }, timing + jitter);
      return () => clearTimeout(t);
    }
  }, [beatIndex, phase]);

  useEffect(() => {
    if (phase === 'expanding') {
      setSqueeze({ x: 1, y: 1 });
      setHeartScale(60);
      const t = setTimeout(() => setPhase('red-screen'), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'red-screen') {
      const t = setTimeout(() => setPhase('gradient'), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'gradient') {
      const t = setTimeout(() => setPhase('particles'), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'particles') {
      const t = setTimeout(() => {
        setOpacity(0);
        setTimeout(onComplete, 1000);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const getBackgroundStyle = (): React.CSSProperties => {
    if (phase === 'red-screen') return { backgroundColor: 'hsl(346, 100%, 65%)' };
    if (phase === 'gradient') return {
      background: 'linear-gradient(180deg, hsl(346, 100%, 65%) 0%, hsl(340, 60%, 18%) 60%, hsl(0, 0%, 0%) 100%)',
    };
    if (phase === 'particles') return {
      background: 'linear-gradient(180deg, hsl(340, 60%, 18%) 0%, hsl(0, 0%, 0%) 100%)',
    };
    return { backgroundColor: '#000000' };
  };

  const isBeating = phase === 'beating';
  const transitionDuration = isBeating ? '180ms' : phase === 'expanding' ? '2000ms' : '800ms';

  return (
    <div
      className="scene-container fixed inset-0 z-50"
      style={{
        ...getBackgroundStyle(),
        opacity,
        transition: 'opacity 1s ease-out, background 1.5s ease-in-out',
      }}
    >
      {/* Heart */}
      {phase !== 'black' && phase !== 'red-screen' && phase !== 'gradient' && phase !== 'particles' && (
        <div
          style={{
            transform: `scale(${heartScale}) scaleX(${squeeze.x}) scaleY(${squeeze.y})`,
            transition: `transform ${transitionDuration} ${isBeating ? 'cubic-bezier(0.25, 0.1, 0.25, 1)' : 'ease-in-out'}`,
            filter: phase === 'expanding' ? 'none' : `drop-shadow(0 0 ${glowIntensity}px hsl(346, 100%, 65%)) drop-shadow(0 0 ${glowIntensity * 2}px hsl(346, 100%, 45%, 0.4))`,
          }}
        >
          <svg
            viewBox="0 0 100 90"
            className="w-20 h-18"
            style={{ width: '80px', height: '72px' }}
          >
            {/* Inner glow / depth gradient */}
            <defs>
              <radialGradient id="heartGrad" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="hsl(346, 100%, 78%)" />
                <stop offset="40%" stopColor="hsl(346, 100%, 65%)" />
                <stop offset="75%" stopColor="hsl(346, 90%, 50%)" />
                <stop offset="100%" stopColor="hsl(340, 80%, 35%)" />
              </radialGradient>
              <radialGradient id="heartShine" cx="35%" cy="30%" r="30%">
                <stop offset="0%" stopColor="hsl(346, 100%, 90%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(346, 100%, 65%)" stopOpacity="0" />
              </radialGradient>
              <filter id="heartShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(340, 80%, 20%)" floodOpacity="0.5" />
              </filter>
            </defs>
            {/* Organic heart shape (slightly asymmetric) */}
            <path
              d="M50 85 C50 85, 7 58, 5 35 C3 20, 12 5, 28 5 C38 5, 46 12, 50 22 C54 12, 63 5, 73 5 C89 5, 98 20, 96 35 C94 58, 50 85, 50 85Z"
              fill="url(#heartGrad)"
              filter="url(#heartShadow)"
            />
            {/* Shine overlay for depth */}
            <path
              d="M50 85 C50 85, 7 58, 5 35 C3 20, 12 5, 28 5 C38 5, 46 12, 50 22 C54 12, 63 5, 73 5 C89 5, 98 20, 96 35 C94 58, 50 85, 50 85Z"
              fill="url(#heartShine)"
            />
            {/* Subtle specular highlight */}
            <ellipse cx="32" cy="25" rx="10" ry="7" fill="hsl(346, 100%, 90%)" opacity="0.25" transform="rotate(-20, 32, 25)" />
          </svg>
        </div>
      )}

      {/* Particles */}
      {phase === 'particles' && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full particle"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                backgroundColor: `hsl(346, 100%, ${60 + Math.random() * 30}%)`,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                '--tx': (Math.random() - 0.5) * 200 + 'px',
                '--ty': (Math.random() - 0.5) * 200 + 'px',
                '--duration': 1.5 + Math.random() * 1.5 + 's',
                '--delay': Math.random() * 0.8 + 's',
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IntroScene;
