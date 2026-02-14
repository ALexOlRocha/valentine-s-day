import React, { useState, useEffect, useRef } from "react";
import { useBackgroundMusic } from "./AudioProvider";

interface FinalSceneProps {
  active: boolean;
}

// Mova o Bouquet para ANTES do FinalScene
const Bouquet: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-out ${
      visible
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-75 translate-y-8"
    }`}
  >
    <svg
      viewBox="0 0 120 160"
      className="w-28 h-36 sm:w-36 sm:h-44"
      style={{ overflow: "visible" }}
    >
      {/* Stems bundle */}
      <path
        d="M60 160 Q55 130 50 100"
        stroke="hsl(140, 35%, 28%)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 160 Q60 125 60 95"
        stroke="hsl(140, 35%, 30%)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 160 Q65 130 70 100"
        stroke="hsl(140, 35%, 28%)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 160 Q52 128 45 105"
        stroke="hsl(140, 30%, 26%)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M60 160 Q68 128 75 105"
        stroke="hsl(140, 30%, 26%)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Ribbon */}
      <path
        d="M50 125 Q60 130 70 125"
        stroke="hsl(43, 72%, 47%)"
        strokeWidth="3"
        fill="none"
      />

      {/* Flowers cluster */}
      {[
        { cx: 50, cy: 70, r: 14, hue: 346 },
        { cx: 70, cy: 65, r: 12, hue: 340 },
        { cx: 60, cy: 50, r: 15, hue: 350 },
        { cx: 45, cy: 55, r: 11, hue: 330 },
        { cx: 75, cy: 80, r: 10, hue: 346 },
        { cx: 55, cy: 85, r: 11, hue: 340 },
      ].map((f, i) => (
        <g key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <ellipse
              key={j}
              cx={f.cx}
              cy={f.cy - f.r * 0.4}
              rx={f.r * 0.4}
              ry={f.r * 0.7}
              fill={`hsl(${f.hue}, ${80 + j * 3}%, ${55 + j * 4}%)`}
              transform={`rotate(${60 * j}, ${f.cx}, ${f.cy})`}
              opacity="0.85"
            />
          ))}
          <circle cx={f.cx} cy={f.cy} r={f.r * 0.25} fill="hsl(43, 72%, 50%)" />
        </g>
      ))}

      {/* Small leaves */}
      <ellipse
        cx="38"
        cy="90"
        rx="8"
        ry="5"
        fill="hsl(140, 40%, 28%)"
        opacity="0.7"
        transform="rotate(-30, 38, 90)"
      />
      <ellipse
        cx="82"
        cy="88"
        rx="8"
        ry="5"
        fill="hsl(140, 40%, 28%)"
        opacity="0.7"
        transform="rotate(30, 82, 88)"
      />
    </svg>

    {/* Glow behind bouquet */}
    <div
      className="absolute inset-0 -z-10 blur-2xl rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(346, 100%, 65%, 0.15) 0%, transparent 70%)",
      }}
    />
  </div>
);

const FinalScene: React.FC<FinalSceneProps> = ({ active }) => {
  const [phase, setPhase] = useState(0);
  const { stopBackgroundMusic } = useBackgroundMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressInterval = useRef<number>();

  useEffect(() => {
    if (!active) return;
    // Stop background music when final scene starts
    stopBackgroundMusic();
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 2000);
    setTimeout(() => setPhase(3), 4000);
  }, [active, stopBackgroundMusic]);

  const togglePlay = () => {
    if (!audioRef.current) {
      // Create audio element - user should place their audio file in public/
      const audio = new Audio("/audio-final.mp4");
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
      });
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        progressInterval.current = window.setInterval(() => {
          setProgress((audio.currentTime / audio.duration) * 100);
        }, 100);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!active) return null;

  return (
    <div className="scene-container bg-background flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-[3000ms]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(346, 100%, 65%, 0.08) 0%, transparent 70%)",
          opacity: phase >= 1 ? 1 : 0,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: 2 + Math.random() * 3 + "px",
              height: 2 + Math.random() * 3 + "px",
              backgroundColor: `hsl(346, 100%, ${60 + Math.random() * 30}%, 0.3)`,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main text */}
      <div
        className={`text-center px-8 z-10 transition-all duration-1000 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-foreground leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Eu te amo
          </span>
        </h1>
        <div className="absolute -inset-4 bg-gradient-to-r from-romantic/0 via-romantic/10 to-romantic/0 blur-3xl -z-10" />
      </div>

      {/* Subtitle */}
      <div
        className={`mt-6 text-center px-8 z-10 transition-all duration-1000 delay-300 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <p className="font-body text-lg sm:text-xl text-muted-foreground/90 italic relative inline-block">
          <span className="relative">
            e isso nunca vai mudar
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="4"
              viewBox="0 0 100 4"
            >
              <path
                d="M0 2 Q25 0, 50 2 Q75 4, 100 2"
                stroke="hsl(var(--romantic)/0.3)"
                fill="none"
                strokeWidth="1"
              />
            </svg>
          </span>
        </p>

        {/* Verso em destaque */}
        <div className="relative max-w-xl mx-auto mt-10 px-4 py-6">
          {/* Aspas decorativas */}
          <div className="absolute -top-2 left-0 text-5xl font-serif text-romantic/20">
            "
          </div>
          <div className="absolute -bottom-2 right-0 text-5xl font-serif text-romantic/20 rotate-180">
            "
          </div>

          <p className="font-serif text-base sm:text-lg text-muted-foreground/80 leading-relaxed tracking-wide">
            <span className="block mb-2">
              "E nesses traços vou tentando descrever
            </span>
            <span className="block mb-2">
              Que mil palavras é tão pouco pra dizer
            </span>
            <span className="block mb-2">
              Que um sentimento muda tudo, muda o mundo
            </span>
            <span className="block">Isso é o amor"</span>
          </p>

          {/* Pequeno coração decorativo */}
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-romantic/30" />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative gold line */}
      <div
        className={`mt-8 w-20 h-px z-10 transition-all duration-1000 delay-500 ${phase >= 2 ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
        style={{ backgroundColor: "hsl(var(--gold))" }}
      />

      {/* Heart */}
      <div
        className={`mt-8 z-10 transition-all duration-1000 delay-700 ${phase >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-10 h-10 animate-float"
          fill="hsl(var(--romantic))"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Audio Player - minimal elegant */}
      <div
        className={`mt-10 z-10 transition-all duration-1000 delay-1000 ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center gap-4 px-6 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-romantic/20 transition-all duration-500">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-muted-foreground/30 hover:border-romantic/50 hover:bg-romantic/5 transition-all duration-300 group"
          >
            {isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                fill="hsl(var(--foreground))"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform"
                fill="hsl(var(--foreground))"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="w-32 sm:w-44 h-1 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 relative"
              style={{
                width: `${progress}%`,
                backgroundColor: "hsl(var(--romantic))",
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-romantic rounded-full shadow-lg shadow-romantic/50" />
            </div>
          </div>

          {/* Duration */}
          {duration > 0 && (
            <span className="text-xs text-muted-foreground/70 font-mono tabular-nums">
              {Math.floor((duration * progress) / 100 / 60)}:
              {String(Math.floor(((duration * progress) / 100) % 60)).padStart(
                2,
                "0",
              )}
            </span>
          )}
        </div>
      </div>

      {/* Signature */}
      <div
        className={`mt-12 z-10 transition-all duration-1000 delay-1200 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}
      >
        <p className="font-bold text-white text-sm tracking-[0.4em] uppercase  relative">
          <span className="relative inline-block">
            para sempre
            <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-romantic/50 to-transparent" />
          </span>
        </p>
      </div>

      {/* ADICIONE O BOUQUET AQUI */}
      <Bouquet visible={phase >= 2} />
    </div>
  );
};

export default FinalScene;
