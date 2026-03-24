'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/lib/game/types';

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'Primeira Vitória',
    description: 'Vença sua primeira partida',
    emoji: '🎉',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'win_streak_5',
    name: 'Em Chamas',
    description: 'Vença 5 partidas seguidas',
    emoji: '🔥',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'win_streak_10',
    name: 'Invencível',
    description: 'Vença 10 partidas seguidas',
    emoji: '👑',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'capture_50_boards',
    name: 'Conquistador',
    description: 'Capture 50 tabuleiros no total',
    emoji: '🎯',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'use_all_elements',
    name: 'Mestre Elemental',
    description: 'Vença com todos os 6 elementos',
    emoji: '⚡',
    unlocked: false,
    progress: 0,
    target: 6,
  },
  {
    id: 'win_under_20_moves',
    name: 'Estrategista',
    description: 'Vença em menos de 20 jogadas',
    emoji: '🧠',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'comeback_king',
    name: 'Rei do Comeback',
    description: 'Vença após estar perdendo por 2 tabuleiros',
    emoji: '💪',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'win_100_games',
    name: 'Lenda Viva',
    description: 'Vença 100 partidas',
    emoji: '🏆',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'play_10_games',
    name: 'Iniciante',
    description: 'Jogue 10 partidas',
    emoji: '🎮',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'reach_level_10',
    name: 'Veterano',
    description: 'Alcance o nível 10',
    emoji: '⭐',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'perfect_game',
    name: 'Jogo Perfeito',
    description: 'Vença sem perder nenhum tabuleiro',
    emoji: '💎',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'speed_demon',
    name: 'Velocista',
    description: 'Vença em menos de 2 minutos',
    emoji: '⚡',
    unlocked: false,
    progress: 0,
    target: 1,
  },
];

interface AchievementCardProps {
  achievement: Achievement;
  compact?: boolean;
}

export function AchievementCard({ achievement, compact = false }: AchievementCardProps) {
  const progressPercentage = (achievement.progress / achievement.target) * 100;

  if (compact) {
    return (
      <div
        className={cn(
          'relative p-2 rounded-lg transition-all',
          achievement.unlocked
            ? 'bg-amber-500/20 border border-amber-500/30'
            : 'bg-black/30 border border-white/5 opacity-60'
        )}
        title={`${achievement.name}: ${achievement.description}`}
      >
        <span className={cn(
          'text-xl',
          !achievement.unlocked && 'grayscale'
        )}>
          {achievement.emoji}
        </span>
        {achievement.unlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white">✓</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative p-4 rounded-xl transition-all',
        achievement.unlocked
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30'
          : 'bg-black/30 border border-white/5'
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn(
          'text-3xl',
          !achievement.unlocked && 'grayscale opacity-50'
        )}>
          {achievement.emoji}
        </span>

        <div className="flex-1">
          <h4 className={cn(
            'font-bold',
            achievement.unlocked ? 'text-amber-400' : 'text-white'
          )}>
            {achievement.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {achievement.description}
          </p>

          {/* Progress bar */}
          {!achievement.unlocked && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{achievement.progress}/{achievement.target}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {achievement.unlocked && (
            <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
              <span>✓</span>
              <span>Desbloqueado!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AchievementsPanelProps {
  achievements: Achievement[];
  showUnlockedOnly?: boolean;
}

export function AchievementsPanel({ achievements, showUnlockedOnly = false }: AchievementsPanelProps) {
  const filteredAchievements = showUnlockedOnly
    ? achievements.filter((a) => a.unlocked)
    : achievements;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-amber-400">🏅 Conquistas</h3>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <span className="text-4xl mb-2 block">🔒</span>
          <p>Nenhuma conquista desbloqueada ainda</p>
          <p className="text-xs">Continue jogando para desbloquear!</p>
        </div>
      )}
    </div>
  );
}

// Hook for managing achievements
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  useEffect(() => {
    localStorage.setItem('xixibola_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const updateProgress = (id: string, progress: number) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;

        const newProgress = Math.min(progress, a.target);
        const unlocked = newProgress >= a.target;

        return {
          ...a,
          progress: newProgress,
          unlocked: unlocked ? true : a.unlocked,
        };
      })
    );
  };

  const incrementProgress = (id: string, amount: number = 1) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;

        const newProgress = a.progress + amount;
        const unlocked = newProgress >= a.target;

        return {
          ...a,
          progress: newProgress,
          unlocked: unlocked ? true : a.unlocked,
        };
      })
    );
  };

  return { achievements, updateProgress, incrementProgress };
}
