import React, { useState, useEffect } from "react";

interface FlowersSceneProps {
  active: boolean;
  onComplete: () => void;
}

const Petal: React.FC<{ delay: number; left: number; size: number }> = ({
  delay,
  left,
  size,
}) => (
  <div
    className="absolute animate-petal"
    style={
      {
        left: `${left}%`,
        top: "-5%",
        "--fall-delay": `${delay}s`,
        "--fall-duration": `${5 + Math.random() * 4}s`,
        "--drift": `${(Math.random() - 0.5) * 60}px`,
        "--spin": `${Math.random() * 720 - 360}deg`,
      } as React.CSSProperties
    }
  >
    <svg
      viewBox="0 0 20 28"
      style={{ width: size, height: size * 1.4 }}
      className="opacity-70"
    >
      <ellipse
        cx="10"
        cy="14"
        rx="8"
        ry="13"
        fill={`hsl(346, ${70 + Math.random() * 30}%, ${55 + Math.random() * 20}%)`}
        opacity={0.6 + Math.random() * 0.4}
      />
    </svg>
  </div>
);

/* Realistic SVG flower that blooms */
const Flower: React.FC<{
  x: number;
  delay: number;
  scale: number;
  type: number;
}> = ({ x, delay, scale, type }) => {
  const [bloomed, setBloomed] = useState(false);

  // FIX: random apenas uma vez
  const stemHeight = React.useMemo(() => 90 + Math.random() * 20, []);
  const curveOffset = React.useMemo(() => 28 + Math.random() * 4, []);

  useEffect(() => {
    const t = setTimeout(() => setBloomed(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const petalColors = [
    ["hsl(346, 85%, 65%)", "hsl(346, 90%, 55%)"],
    ["hsl(340, 70%, 60%)", "hsl(340, 80%, 45%)"],
    ["hsl(350, 80%, 70%)", "hsl(350, 85%, 55%)"],
    ["hsl(330, 60%, 65%)", "hsl(330, 70%, 50%)"],
  ];

  const [petal1, petal2] = petalColors[type % petalColors.length];

  return (
    <div
      className="absolute bottom-0"
      style={{
        left: `${x}%`,
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    >
      <svg
        viewBox="0 0 60 160"
        className="w-14 h-40 sm:w-16 sm:h-44"
        style={{
          overflow: "visible",
        }}
      >
        {/* CLIP para crescer como planta */}
        <defs>
          <clipPath id={`grow-${x}`}>
            <rect
              x="0"
              y={bloomed ? 0 : 160}
              width="60"
              height={bloomed ? 160 : 0}
              style={{
                transition: "all 1.8s cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: `${delay}ms`,
              }}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#grow-${x})`}>
          {/* Stem */}
          <path
            d={`M30 160 C30 ${160 - stemHeight * 0.3}, ${curveOffset} ${160 - stemHeight * 0.7}, 30 ${160 - stemHeight}`}
            stroke="hsl(140, 35%, 30%)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaf */}
          <path
            d={`M30 ${160 - stemHeight * 0.5} C45 ${160 - stemHeight * 0.55}, 50 ${160 - stemHeight * 0.5}, 38 ${160 - stemHeight * 0.42}`}
            fill="hsl(140, 40%, 32%)"
            opacity="0.9"
          />

          {/* Flower Head FIXADA NA PONTA DO CAULE */}
          <g transform={`translate(30, ${160 - stemHeight})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g
                key={i}
                transform={`rotate(${angle})`}
                style={{
                  transformOrigin: "0 0",
                }}
              >
                <ellipse
                  cx="0"
                  cy="-12"
                  rx="6"
                  ry="12"
                  fill={i % 2 === 0 ? petal1 : petal2}
                  opacity="0.95"
                  style={{
                    transformOrigin: "0 0",
                    transform: bloomed ? "scale(1)" : "scale(0.1)",
                    transition: "transform 1.2s cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: `${delay + 1200}ms`,
                  }}
                />
              </g>
            ))}

            <circle cx="0" cy="0" r="5" fill="hsl(43, 72%, 47%)" />
            <circle
              cx="-1"
              cy="-1"
              r="3"
              fill="hsl(43, 72%, 60%)"
              opacity="0.5"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

const FlowersScene: React.FC<FlowersSceneProps> = ({ active, onComplete }) => {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);

  useEffect(() => {
    if (!active) return;
    setTimeout(() => setShowText(true), 1500);
    setTimeout(() => setShowFlowers(true), 2500);
    setTimeout(() => setShowButton(true), 5500);
  }, [active]);

  if (!active) return null;

  const petals = Array.from({ length: 20 }).map((_, i) => ({
    delay: Math.random() * 4,
    left: Math.random() * 100,
    size: 10 + Math.random() * 14,
  }));

  const flowers = [
    { x: 8, delay: 0, scale: 0.7, type: 0 },
    { x: 22, delay: 400, scale: 0.9, type: 1 },
    { x: 38, delay: 200, scale: 1, type: 2 },
    { x: 52, delay: 600, scale: 0.85, type: 3 },
    { x: 65, delay: 300, scale: 0.95, type: 0 },
    { x: 78, delay: 500, scale: 0.8, type: 1 },
    { x: 90, delay: 150, scale: 0.75, type: 2 },
  ];

  return (
    <div className="scene-container bg-background flex-col overflow-hidden">
      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((p, i) => (
          <Petal key={i} {...p} />
        ))}
      </div>

      {/* Growing flowers from bottom */}
      {showFlowers && (
        <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 pointer-events-none">
          {flowers.map((f, i) => (
            <Flower key={i} {...f} />
          ))}
        </div>
      )}

      {/* Declaration text */}
      <div
        className={`text-center px-8 z-10 transition-all duration-1000 ${showText ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-foreground mb-4">
          Na linha do tempo, o destino escreveu
        </h2>
        <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-romantic italic">
          Com letras douradas, você e eu
        </p>
      </div>

      {/* Decorative line */}
      <div
        className={`mt-8 w-16 h-px bg-gold transition-all duration-1000 delay-500 ${showText ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
      />

      {/* Continue */}
      <button
        onClick={onComplete}
        className={`mt-12 font-display text-sm tracking-[0.3em] uppercase text-muted-foreground hover:text-romantic transition-all duration-700 z-10 ${showButton ? "opacity-100" : "opacity-0"}`}
      >
        continuar ❯
      </button>
    </div>
  );
};

export default FlowersScene;
