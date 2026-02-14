"use client";

import React, { useState, useEffect, useCallback } from "react";

interface MemoriesSceneProps {
  active: boolean;
  onComplete: () => void;
}

const memories = [
  {
    text: "Tudo iniciou aqui",
    color: "hsl(340, 80%, 65%)",
    image: "/primeira-conversa.jpg",
    gradient: "from-pink-500/30 to-rose-500/30",
  },
  {
    text: "Os olhos mais lindos desse mundo 🙃",
    color: "hsl(346, 100%, 75%)",
    image: "/olhar.jpg",
    gradient: "from-amber-500/30 to-rose-400/30",
  },
  {
    text: "E nesse dia foi o que eu me apaixonei por ti",
    color: "hsl(340, 80%, 65%)",
    image: "/o-dia-que-eu-me-apaixonei.jpg",
    gradient: "from-purple-500/30 to-pink-500/30",
  },
  {
    text: "Nosso primeiro encontro",
    color: "hsl(43, 72%, 57%)",
    image: "/primeiro-encontro.jpg",
    gradient: "from-yellow-500/30 to-amber-500/30",
  },
  {
    text: "Um dia importante marcado na nossa relação",
    color: "hsl(346, 80%, 65%)",
    image: "/aniversario.jpg",
    gradient: "from-rose-500/30 to-red-400/30",
  },
  {
    text: "A garota que eu me apaixonei kkkkkk tem nem tamanho",
    color: "hsl(340, 60%, 55%)",
    image: "/urso.jpg",
    gradient: "from-blue-500/30 to-indigo-500/30",
  },
  {
    text: "Essa garota me deu até flor kkkkk",
    color: "hsl(346, 100%, 75%)",
    image: "/ganhei-flor.jpg",
    gradient: "from-green-500/30 to-emerald-500/30",
  },
  {
    text: "Esse foi o dia que mais me senti realizado",
    color: "hsl(340, 60%, 55%)",
    image: "/flores.jpg",
    gradient: "from-orange-500/30 to-red-500/30",
  },
  {
    text: "Que nessas frases tem um pouco de nós dois...",
    color: "hsl(346, 100%, 75%)",
    image: "/desenho.jpg",
    gradient: "from-violet-500/30 to-purple-500/30",
  },
];

const MemoriesScene: React.FC<MemoriesSceneProps> = ({
  active,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 segundos (1 minuto)
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [memoriesComplete, setMemoriesComplete] = useState(false);

  // Timer de 60 segundos para o botão aparecer
  useEffect(() => {
    if (!memoriesComplete || !isTimerActive) return;

    if (timeLeft <= 0) {
      setShowButton(true);
      setIsTimerActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [memoriesComplete, isTimerActive, timeLeft]);

  // Efeito de pulso quando o timer está acabando (últimos 10 segundos)
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && memoriesComplete) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [timeLeft, memoriesComplete]);

  const handleComplete = useCallback(() => {
    if (showButton) {
      onComplete();
    }
  }, [showButton, onComplete]);

  useEffect(() => {
    if (!active) return;

    setCurrentIndex(0);
    setShowButton(false);
    setTimeLeft(60);
    setIsTimerActive(false);
    setMemoriesComplete(false);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= memories.length - 1) {
          clearInterval(interval);
          // Quando as memórias terminam, inicia o timer de 60 segundos
          setMemoriesComplete(true);
          setIsTimerActive(true);
          return prev;
        }
        return prev + 1;
      });
    }, 5000); // 5 segundos por memória

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  // Formata o tempo para exibição (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-black overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Glow de fundo com animação suave */}
      <div className="absolute w-[900px] h-[900px] bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 blur-[150px] rounded-full animate-pulse-slow" />

      {/* Indicador de progresso */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {memories.map((_, i) => (
          <div key={i} className="relative group">
            <div
              className={`h-1 rounded-full transition-all duration-700 ${
                i <= currentIndex
                  ? "w-8 bg-gradient-to-r from-rose-400 to-pink-400"
                  : "w-2 bg-white/20 group-hover:w-4 group-hover:bg-white/40"
              }`}
            />
            {i === currentIndex && (
              <div className="absolute -top-1 left-0 w-8 h-1 bg-white/40 blur-md animate-pulse" />
            )}
          </div>
        ))}
      </div>

      <div className="relative w-80 h-96 sm:w-96 sm:h-[30rem] perspective">
        {memories.map((memory, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;
          const offset = i - currentIndex;

          return (
            <div
              key={i}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-[1500ms] ease-out backdrop-blur-sm"
              style={{
                transform: isPast
                  ? `translateY(-${(currentIndex - i) * 40}px) scale(${1 - (currentIndex - i) * 0.08}) rotate(${i % 2 === 0 ? -3 : 3}deg) translateZ(${-currentIndex * 50}px)`
                  : isActive
                    ? "translateY(0) scale(1) rotate(0deg) translateZ(100px)"
                    : `translateY(${offset * 30}px) scale(${1 - offset * 0.06}) rotate(${offset * 2}deg) translateZ(${-offset * 30}px)`,
                opacity: isPast
                  ? Math.max(0, 1 - (currentIndex - i) * 0.4)
                  : isActive
                    ? 1
                    : 0.1,
                zIndex: memories.length - Math.abs(offset),
                boxShadow: isActive
                  ? `0 30px 60px -15px ${memory.color.replace("hsl", "hsla").replace(")", ", 0.3)")}`
                  : "none",
              }}
            >
              {/* IMAGEM FUNDO COM PARALLAX */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out"
                style={{
                  backgroundImage: `url(${memory.image})`,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  filter: isActive ? "brightness(1.1)" : "brightness(0.7)",
                }}
              />

              {/* Gradiente overlay dinâmico */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${memory.gradient} mix-blend-overlay`}
              />

              {/* Overlay cinematográfico */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Brilho nas bordas */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-3xl border-2 border-white/20"
                  style={{
                    boxShadow: `inset 0 0 30px ${memory.color.replace("hsl", "hsla").replace(")", ", 0.3)")}`,
                  }}
                />
              )}

              {/* Linha decorativa superior */}
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-[2px] rounded-full transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, transparent, ${memory.color}, transparent)`,
                  opacity: isActive ? 1 : 0.2,
                  width: isActive ? "120px" : "60px",
                }}
              />

              {/* TEXTO */}
              <div className="relative z-10 h-full flex items-center justify-center px-8 text-center">
                <div className="transform transition-all duration-1000">
                  <p
                    className="text-2xl sm:text-3xl font-light italic leading-relaxed drop-shadow-2xl"
                    style={{
                      color: isActive ? "white" : "rgba(255,255,255,0.35)",
                      textShadow: isActive
                        ? `0 0 30px ${memory.color}`
                        : "none",
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {memory.text}
                  </p>
                </div>
              </div>

              {/* Elementos decorativos flutuantes */}
              {isActive && (
                <>
                  <div className="absolute top-12 left-8 w-16 h-16 border-l-2 border-t-2 border-white/10 rounded-tl-3xl" />
                  <div className="absolute bottom-12 right-8 w-16 h-16 border-r-2 border-b-2 border-white/10 rounded-br-3xl" />
                </>
              )}

              {/* Coração decorativo pulsante */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 transition-all duration-1000"
                  style={{
                    fill: memory.color,
                    opacity: isActive ? 1 : 0.2,
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${memory.color})`
                      : "none",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* MENSAGEM DE ESPERA E BOTÃO FINAL */}
      {memoriesComplete && (
        <div className="relative mt-16 flex flex-col items-center gap-6">
          {!showButton ? (
            <>
              {/* Timer de espera de 1 minuto */}
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - timeLeft / 60)}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-2xl font-light ${isPulsing ? "text-rose-400 animate-pulse" : "text-white/80"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[10px] text-white/40 mt-1">minuto</span>
                </div>
              </div>

              {/* Mensagem poética */}
              <div className="text-center space-y-2">
                <p className="text-white/60 text-sm tracking-wider animate-pulse">
                  ✦ aguarde um momento ✦
                </p>
                <p className="text-white/30 text-xs max-w-[250px] font-light italic">
                  "O amor tem seu próprio tempo,
                  <br />
                  cada segundo é uma memória"
                </p>
              </div>
            </>
          ) : (
            /* BOTÃO FINAL - só aparece após 1 minuto */
            <button
              onClick={handleComplete}
              className="group relative px-10 py-4 overflow-hidden rounded-2xl transition-all duration-700 hover:scale-105 animate-fadeIn"
            >
              {/* Fundo com gradiente animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 group-hover:from-rose-500/30 group-hover:to-pink-500/30 transition-all duration-700 blur-xl group-hover:blur-2xl" />

              {/* Borda gradiente */}
              <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-rose-400/50 transition-all duration-700" />

              {/* Conteúdo do botão */}
              <div className="relative flex items-center gap-3">
                <span className="text-xs tracking-[0.4em] uppercase text-white/90 group-hover:text-white">
                  continuar
                </span>
                <svg
                  className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoriesScene;
