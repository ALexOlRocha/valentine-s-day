import React, { useState, useCallback } from 'react';
import { AudioProvider } from '@/components/AudioProvider';
import IntroScene from '@/components/IntroScene';
import EnvelopeScene from '@/components/EnvelopeScene';
import LetterScene from '@/components/LetterScene';
import FlowersScene from '@/components/FlowersScene';
import EyeScene from '@/components/EyeScene';
import MemoriesScene from '@/components/MemoriesScene';
import FinalScene from '@/components/FinalScene';

type Scene = 'intro' | 'envelope' | 'letter' | 'flowers' | 'eye' | 'memories' | 'final';

const Index = () => {
  const [currentScene, setCurrentScene] = useState<Scene>('intro');
  const [transitioning, setTransitioning] = useState(false);

  const transitionTo = useCallback((next: Scene) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScene(next);
      setTransitioning(false);
    }, 600);
  }, []);

  return (
    <AudioProvider>
      <div className="relative w-full min-h-screen bg-background overflow-hidden">
        {/* Transition overlay */}
        <div
          className="fixed inset-0 bg-background z-40 pointer-events-none transition-opacity duration-600"
          style={{ opacity: transitioning ? 1 : 0 }}
        />

        {currentScene === 'intro' && (
          <IntroScene onComplete={() => transitionTo('envelope')} />
        )}

        <EnvelopeScene
          active={currentScene === 'envelope'}
          onOpenLetter={() => transitionTo('letter')}
        />

        <LetterScene
          active={currentScene === 'letter'}
          onComplete={() => transitionTo('flowers')}
        />

        <FlowersScene
          active={currentScene === 'flowers'}
          onComplete={() => transitionTo('eye')}
        />

        <EyeScene
          active={currentScene === 'eye'}
          onComplete={() => transitionTo('memories')}
        />

        <MemoriesScene
          active={currentScene === 'memories'}
          onComplete={() => transitionTo('final')}
        />

        <FinalScene active={currentScene === 'final'} />
      </div>
    </AudioProvider>
  );
};

export default Index;
