import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

interface AudioContextType {
  startBackgroundMusic: (src: string) => void;
  stopBackgroundMusic: () => void;
  isMusicPlaying: boolean;
}

const AudioContext = createContext<AudioContextType>({
  startBackgroundMusic: () => {},
  stopBackgroundMusic: () => {},
  isMusicPlaying: false,
});

export const useBackgroundMusic = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const startBackgroundMusic = useCallback((src: string) => {
    if (audioRef.current) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    
    audio.play().then(() => {
      setIsMusicPlaying(true);
      // Fade in over 3 seconds
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, 0.4);
        audio.volume = vol;
        if (vol >= 0.4) clearInterval(fadeIn);
      }, 60);
    }).catch(() => {
      // Autoplay blocked, will try on next interaction
      audioRef.current = null;
    });
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    let vol = audio.volume;
    const fadeOut = setInterval(() => {
      vol = Math.max(vol - 0.02, 0);
      audio.volume = vol;
      if (vol <= 0) {
        clearInterval(fadeOut);
        audio.pause();
        audioRef.current = null;
        setIsMusicPlaying(false);
      }
    }, 60);
  }, []);

  return (
    <AudioContext.Provider value={{ startBackgroundMusic, stopBackgroundMusic, isMusicPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};
