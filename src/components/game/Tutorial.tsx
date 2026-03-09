'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TutorialStep {
  title: string;
  description: string;
  emoji: string;
  visual?: React.ReactNode;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Bem-vindo ao XIXIBOLA PRIME!',
    description: 'Este é um jogo estratégico inspirado no Ultimate Tic-Tac-Toe, mas com poderes elementais e mecânicas únicas!',
    emoji: '🎮',
  },
  {
    title: 'O Tabuleiro Mestre',
    description: 'Existem 9 quadrados grandes. Cada quadrado contém um tabuleiro 3×3 interno. É como 9 jogos da velha em um!',
    emoji: '📐',
  },
  {
    title: 'A Regra de Ouro',
    description: 'Quando você joga em uma célula, a posição dessa célula determina em qual tabuleiro o adversário deve jogar. Exemplo: jogar no canto superior esquerdo envia o oponente para o tabuleiro superior esquerdo.',
    emoji: '🎯',
  },
  {
    title: 'Conquistando Tabuleiros',
    description: 'Vença um tabuleiro interno fazendo 3 em linha. Esse tabuleiro inteiro se torna seu! O objetivo é conquistar 3 tabuleiros em linha ou 5 no total.',
    emoji: '🏆',
  },
  {
    title: 'Poderes Elementais',
    description: 'Antes de cada partida, escolha um elemento! Cada um tem um poder único: Fogo queima células, Gelo congela tabuleiros, Raio dá jogada dupla, e mais!',
    emoji: '⚡',
  },
  {
    title: 'Estratégia é Tudo',
    description: 'Planeje seus movimentos! Você pode forçar o adversário a jogar em tabuleiros ruins. Use seus poderes no momento certo para virar o jogo!',
    emoji: '🧠',
  },
  {
    title: 'Pronto para Jogar!',
    description: 'Agora você conhece o básico! Escolha seu elemento e entre na arena. Boa sorte, estrategista!',
    emoji: '⚔️',
  },
];

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Tutorial</span>
            <span>{currentStep + 1} / {TUTORIAL_STEPS.length}</span>
          </div>
          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20 text-center">
          {/* Emoji */}
          <div className="text-6xl mb-4 animate-bounce">
            {step.emoji}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-sm sm:text-base mb-6">
            {step.description}
          </p>

          {/* Visual Example for Rule Step */}
          {currentStep === 2 && (
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-1 w-32 h-32 mx-auto">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded border border-amber-500/30 flex items-center justify-center text-xs',
                      i === 0 ? 'bg-amber-500/30 text-amber-400' : 'bg-black/30'
                    )}
                  >
                    {i === 0 ? '👉' : ''}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Canto superior esquerdo → Tabuleiro superior esquerdo
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {!isFirstStep && (
              <Button
                onClick={() => setCurrentStep(s => s - 1)}
                variant="outline"
                className="border-amber-500/30 text-amber-400"
              >
                ← Anterior
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold"
              >
                Começar a Jogar! 🎮
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(s => s + 1)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold"
              >
                Próximo →
              </Button>
            )}
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-4">
          <button
            onClick={onSkip}
            className="text-xs text-muted-foreground hover:text-amber-400 transition-colors"
          >
            Pular Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

// Quick tip component
interface QuickTipProps {
  tip: string;
  onClose: () => void;
}

export function QuickTip({ tip, onClose }: QuickTipProps) {
  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20 z-40 animate-slide-up">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <p className="text-sm text-white">{tip}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Hook for managing tutorial state
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('xixibola_tutorial_completed');
    }
    return false;
  });

  const completeTutorial = () => {
    localStorage.setItem('xixibola_tutorial_completed', 'true');
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    localStorage.setItem('xixibola_tutorial_completed', 'true');
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem('xixibola_tutorial_completed');
    setShowTutorial(true);
  };

  return { showTutorial, completeTutorial, skipTutorial, resetTutorial };
}
