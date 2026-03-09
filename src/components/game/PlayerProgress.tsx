'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ELEMENT_COLORS } from '@/lib/game/constants';
import type { PlayerStats, Element } from '@/lib/game/types';

interface PlayerProgressProps {
  stats: PlayerStats;
  compact?: boolean;
}

export function PlayerProgress({ stats, compact = false }: PlayerProgressProps) {
  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-black/30 rounded-lg p-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold">
          {stats.level}
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
      {/* Level Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-amber-500/30">
              {stats.level}
            </div>
            <div className="absolute -bottom-1 -right-1 text-xs bg-black px-1.5 py-0.5 rounded-full text-amber-400 border border-amber-500/30">
              NÍVEL
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Jogador</h3>
            <p className="text-xs text-muted-foreground">
              {stats.xp} / {stats.xpToNextLevel} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">{stats.wins}</p>
          <p className="text-xs text-muted-foreground">Vitórias</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progresso para Nível {stats.level + 1}</span>
          <span>{Math.round(xpPercentage)}%</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-black/30 rounded-lg p-2">
          <p className="text-lg font-bold text-white">{stats.totalGames}</p>
          <p className="text-[10px] text-muted-foreground">Partidas</p>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <p className="text-lg font-bold text-green-400">{stats.wins}</p>
          <p className="text-[10px] text-muted-foreground">Vitórias</p>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <p className="text-lg font-bold text-red-400">{stats.losses}</p>
          <p className="text-[10px] text-muted-foreground">Derrotas</p>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <p className="text-lg font-bold text-amber-400">{stats.winStreak}</p>
          <p className="text-[10px] text-muted-foreground">Sequência</p>
        </div>
      </div>

      {/* Element Stats */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Estatísticas por Elemento</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(stats.elementStats) as [Element, { wins: number; games: number }][]).slice(0, 6).map(([element, data]) => {
            const colors = ELEMENT_COLORS[element];
            const winRate = data.games > 0 ? Math.round((data.wins / data.games) * 100) : 0;

            return (
              <div
                key={element}
                className="bg-black/30 rounded-lg p-2 text-center"
                style={{ borderColor: colors.primary, borderWidth: 1 }}
              >
                <p className="text-xs font-medium" style={{ color: colors.primary }}>
                  {element.charAt(0).toUpperCase() + element.slice(1)}
                </p>
                <p className="text-sm font-bold text-white">{winRate}%</p>
                <p className="text-[10px] text-muted-foreground">
                  {data.games} jogos
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Leaderboard component
interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  wins: number;
  element: Element;
  isPlayer?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
      <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">
        🏆 Ranking Global
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((entry) => {
          const colors = ELEMENT_COLORS[entry.element];

          return (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-colors',
                entry.isPlayer
                  ? 'bg-amber-500/20 ring-1 ring-amber-500/50'
                  : 'bg-black/30 hover:bg-black/40'
              )}
            >
              {/* Rank */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  entry.rank === 1 && 'bg-yellow-500 text-black',
                  entry.rank === 2 && 'bg-gray-400 text-black',
                  entry.rank === 3 && 'bg-amber-700 text-black',
                  entry.rank > 3 && 'bg-black/50 text-muted-foreground'
                )}
              >
                {entry.rank <= 3 ? '🏆' : entry.rank}
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  entry.isPlayer ? 'text-amber-400' : 'text-white'
                )}>
                  {entry.name}
                  {entry.isPlayer && ' (Você)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Nível {entry.level}
                </p>
              </div>

              {/* Element Badge */}
              <div
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                {entry.element.charAt(0).toUpperCase() + entry.element.slice(1)}
              </div>

              {/* Wins */}
              <div className="text-right">
                <p className="font-bold text-white">{entry.wins}</p>
                <p className="text-[10px] text-muted-foreground">vitórias</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Hook for managing player stats
export function usePlayerStats() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xixibola_player_stats');
      if (saved) {
        return JSON.parse(saved);
      }
    }

    // Default stats
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      bestStreak: 0,
      elementStats: {
        fire: { wins: 0, games: 0 },
        ice: { wins: 0, games: 0 },
        lightning: { wins: 0, games: 0 },
        wind: { wins: 0, games: 0 },
        darkness: { wins: 0, games: 0 },
        light: { wins: 0, games: 0 },
      },
      achievements: [],
    };
  });

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('xixibola_player_stats', JSON.stringify(stats));
  }, [stats]);

  const addXp = (amount: number) => {
    setStats((prev: PlayerStats) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;

      // Level up check
      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel++;
        xpToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
      };
    });
  };

  const recordGame = (result: 'win' | 'loss' | 'draw', element: Element) => {
    setStats((prev: PlayerStats) => {
      const newWinStreak = result === 'win' ? prev.winStreak + 1 : 0;

      return {
        ...prev,
        totalGames: prev.totalGames + 1,
        wins: result === 'win' ? prev.wins + 1 : prev.wins,
        losses: result === 'loss' ? prev.losses + 1 : prev.losses,
        draws: result === 'draw' ? prev.draws + 1 : prev.draws,
        winStreak: newWinStreak,
        bestStreak: Math.max(prev.bestStreak, newWinStreak),
        elementStats: {
          ...prev.elementStats,
          [element]: {
            wins: prev.elementStats[element].wins + (result === 'win' ? 1 : 0),
            games: prev.elementStats[element].games + 1,
          },
        },
      };
    });

    // Add XP based on result
    if (result === 'win') addXp(50);
    else if (result === 'draw') addXp(20);
    else addXp(10);
  };

  return { stats, addXp, recordGame };
}
