import React, { useState, useEffect, useRef } from "react";
import { useBackgroundMusic } from "./AudioProvider";

interface LetterSceneProps {
  active: boolean;
  onComplete: () => void;
}

const letterLines = [
  "Foi em um dia comum que eu te conheci.",
  "Mas aquele dia deixou de ser comum.",
  "",
  "Foi incrível olhar nos seus olhos",
  "e sentir uma intensidade que eu nunca tinha sentido.",
  "",
  "Parecia que eu estava em um pôr do sol,",
  "olhando a mais bela paisagem já esculpida.",
  "",
  "Meu corpo ficou leve naquele momento.",
  "Você parecia um furacão impossível de controlar,",
  "mas que carrega uma liberdade",
  "que eu admiro em cada ação sua.",
  "",
  "Foi ali que eu me apaixonei.",
  "",
  "Eu amadureci ao seu lado.",
  "Estou amadurecendo.",
  "Estou crescendo.",
  "Estou evoluindo de verdade.",
  "",
  "Não porque eu não tinha capacidade,",
  "mas porque você me mostrou que eu tinha.",
  "Obrigado por isso.",
  "",
  "Eu gosto muito de você.",
  "Eu te amo.",
  "",
  "Mesmo com problemas,",
  "mesmo quando faltar força,",
  "eu vou me levantar para te defender,",
  "te proteger e te ajudar.",
  "",
  "Porque eu escolho você",
  "em todos os momentos,",
  "em todas as fases.",
  "",
  "O meu amor por você não é raso.",
  "Não é desse mundo.",
  "E não nasceu do nada.",
  "",
  "Eu cultivei esse amor.",
  "Assim como um floricultor rega e cuida",
  "para que as flores cresçam,",
  "eu cuido do nosso amor.",
  "",
  "Eu estou à frente disso.",
  "Vou cuidar de você.",
  "Vou suprir.",
  "Vou me dedicar com tudo o que eu tenho.",
  "",
  "Porque você será a flor mais linda.",
  "E será meu maior orgulho.",
  "",
  "Eu sei que estamos no caminho.",
  "Ainda temos muito trabalho pela frente.",
  "",
  "Mas eu preciso saber:",
  "você está disposta a estar ao meu lado?",
  "",
  "Você é forte.",
  "Corajosa.",
  "Intensa.",
  "Dedicada.",
  "",
  "Sua decisão me inspira.",
  "Você me inspira.",
  "",
  "Você é linda.",
  "Mas é ainda mais linda pela sua capacidade",
  "de crescer e evoluir.",
  "",
  "Você tem um potencial enorme.",
  "Eu acredito em você.",
  "",
  "Você é luz.",
  "E Deus está contigo.",
  "",
  "E eu também vou estar.",
  "Em todos os momentos.",
  "",
  "Vou aplaudir cada uma das suas conquistas.",
  "",
  "Eu te amo, Gabriela.",
  "Minha tampinha. 💕",
];
const LetterScene: React.FC<LetterSceneProps> = ({ active, onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const { startBackgroundMusic } = useBackgroundMusic();
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= letterLines.length) {
          clearInterval(interval);
          setTimeout(() => setShowContinue(true), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [active]);

  const handlePlayVoice = () => {
    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio("/audio.mp3"); // Substitua pelo caminho correto do áudio
    }

    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play();
      setIsPlayingVoice(true);

      // Quando o áudio terminar, volta ao estado inicial
      voiceAudioRef.current.onended = () => {
        setIsPlayingVoice(false);
      };
    }
  };

  const handleComplete = () => {
    // Para o áudio da voz se estiver tocando
    if (voiceAudioRef.current && isPlayingVoice) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      setIsPlayingVoice(false);
    }

    // Start background music on user interaction (respects autoplay policy)
    startBackgroundMusic("/linha-do-tempo.mp3");
    onComplete();
  };

  if (!active) return null;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* TEXTO */}
        <div className="space-y-3 sm:space-y-4">
          {letterLines.map((line, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out ${
                i < visibleLines
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${Math.min(i * 40, 200)}ms` }}
            >
              {line === "" ? (
                <div className="h-4 sm:h-6" />
              ) : (
                <p className="font-body text-base sm:text-lg md:text-xl leading-relaxed text-foreground/90 italic px-2">
                  {line}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col items-center gap-6 mt-14">
          {/* BOTÃO OUVIR VOZ */}
          <button
            onClick={handlePlayVoice}
            className={`
      w-full max-w-sm
      flex items-center justify-center gap-3
      px-6 py-3
      rounded-full
      border
      text-sm sm:text-base
      font-semibold
      tracking-wide
      transition-all duration-300
      active:scale-95
      shadow-md
      ${
        isPlayingVoice
          ? "bg-romantic text-white border-romantic shadow-lg"
          : "bg-white/5 backdrop-blur border-white/20 text-foreground hover:bg-white/10"
      }
      ${showContinue ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    `}
          >
            <span className="text-lg">{isPlayingVoice ? "🔊" : "🎤"}</span>

            {isPlayingVoice
              ? "Tocando sua voz..."
              : "Ouvir a voz do seu digníssimo"}
          </button>

          {/* BOTÃO PRINCIPAL */}
          <button
            onClick={handleComplete}
            className={`
      w-full max-w-sm
      px-6 py-3
      rounded-full
      text-sm sm:text-base
      font-semibold
      tracking-wide
      transition-all duration-300
      active:scale-95
      shadow-lg
      bg-romantic
      text-white
      hover:brightness-110
      ${showContinue ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    `}
          >
            💌 Eu li, quero continuar
          </button>

          {/* DICA VISUAL */}
          {showContinue && (
            <p className="text-xs text-muted-foreground animate-pulse">
              Toque em um botão para continuar ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default LetterScene;
