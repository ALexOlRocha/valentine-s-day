import React, { useState, useEffect } from "react";

interface EnvelopeSceneProps {
  active: boolean;
  onOpenLetter: () => void;
}

const EnvelopeScene: React.FC<EnvelopeSceneProps> = ({
  active,
  onOpenLetter,
}) => {
  const [visible, setVisible] = useState(false);
  const [flap, setFlap] = useState(false);
  const [letterRise, setLetterRise] = useState(false);

  useEffect(() => {
    if (active) {
      setTimeout(() => setVisible(true), 300);
    }
  }, [active]);

  const handleClick = () => {
    if (flap) return;
    setFlap(true);
    setTimeout(() => setLetterRise(true), 600);
    setTimeout(() => onOpenLetter(), 1800);
  };

  if (!active) return null;

  return (
    <div className="scene-container bg-background">
      {/* Subtle ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 2 + "px",
              height: 2 + "px",
              backgroundColor: "hsl(var(--romantic))",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Envelope */}
      <div
        className={`cursor-pointer transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        onClick={handleClick}
        style={{ perspective: "600px" }}
      >
        <div className="relative animate-float">
          {/* Envelope body */}
          <div
            className="relative w-64 h-44 sm:w-72 sm:h-48 rounded-md overflow-visible"
            style={{ backgroundColor: "hsl(var(--graphite))" }}
          >
            {/* Envelope texture */}
            <div className="absolute inset-0 border border-border rounded-md" />

            {/* Gold seal */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "hsl(var(--gold))",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="hsl(var(--gold-foreground))"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Flap */}
            <div
              className="absolute -top-[1px] left-0 right-0 origin-top transition-transform duration-700 ease-in-out"
              style={{
                transform: flap ? "rotateX(-180deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="w-full border border-border"
                style={{
                  height: "0",
                  borderLeft: "128px solid transparent",
                  borderRight: "128px solid transparent",
                  borderTop: "80px solid hsl(var(--secondary))",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
              />
            </div>

            {/* Letter inside */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[85%] rounded-sm transition-all duration-1000 ease-out ${letterRise ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundColor: "hsl(var(--soft-white))",
                height: "70%",
                top: letterRise ? "-40%" : "10%",
              }}
            >
              <div className="p-3 space-y-2">
                <div
                  className="w-3/4 h-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--muted))" }}
                />
                <div
                  className="w-1/2 h-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--muted))" }}
                />
                <div
                  className="w-2/3 h-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--muted))" }}
                />
              </div>
            </div>
          </div>

          {/* Label */}
          <p
            className={`text-center mt-6 font-display text-lg tracking-widest text-muted-foreground transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "1s" }}
          >
            {flap ? "" : "toque para abrir"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnvelopeScene;
