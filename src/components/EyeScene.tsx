import React, { useState, useEffect } from "react";

interface EyeSceneProps {
  active: boolean;
  onComplete: () => void;
}

const EyeScene: React.FC<EyeSceneProps> = ({ active, onComplete }) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "text">(
    "closed",
  );
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!active) return;
    setTimeout(() => setPhase("opening"), 800);
    setTimeout(() => setPhase("open"), 2000);
    setTimeout(() => setPhase("text"), 3000);
    setTimeout(() => setShowButton(true), 4500);
  }, [active]);

  if (!active) return null;

  const lidHeight = phase === "closed" ? 50 : phase === "opening" ? 25 : 8;

  return (
    <div className="scene-container bg-background flex-col">
      {/* Eye */}
      <div className="relative w-50 h-auto sm:w-64 sm:h-32 mb-12">
        <img src="/olhos-meus.jpg" alt="meus-olhos" className="w-120 h-auto" />
      </div>

      {/* Text */}
      <div
        className={`text-center px-8 transition-all duration-1000 ${phase === "text" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <p className="font-display text-2xl sm:text-3xl font-light text-foreground/80 italic">
          Eu só queria que você visse
        </p>
        <p className="font-display text-2xl sm:text-3xl font-light text-romantic italic mt-2">
          o mundo pelos meus olhos
        </p>
      </div>

      <button
        onClick={onComplete}
        className={`mt-12 font-display text-sm tracking-[0.3em] uppercase text-muted-foreground hover:text-romantic transition-all duration-700 ${showButton ? "opacity-100" : "opacity-0"}`}
      >
        continuar ❯
      </button>
    </div>
  );
};

export default EyeScene;
