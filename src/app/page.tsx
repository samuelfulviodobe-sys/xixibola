'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Game } from '@/components/game/Game';
import { PlayerProgress, Leaderboard, usePlayerStats } from '@/components/game/PlayerProgress';
import { AchievementsPanel, useAchievements } from '@/components/game/Achievements';
import { GuardianCard } from '@/components/game/GuardianCard';
import { Tutorial, useTutorial } from '@/components/game/Tutorial';
import { GUARDIANS } from '@/lib/game/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Element } from '@/lib/game/types';

type Tab = 'play' | 'progress' | 'achievements' | 'guardians' | 'leaderboard';
type GameMode = 'ai' | 'pvp' | null;

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('play');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { stats } = usePlayerStats();
  const { achievements } = useAchievements();
  const { showTutorial, completeTutorial, skipTutorial } = useTutorial();

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'play', label: 'Jogar', emoji: '🎮' },
    { id: 'progress', label: 'Progresso', emoji: '📊' },
    { id: 'achievements', label: 'Conquistas', emoji: '🏅' },
    { id: 'guardians', label: 'Guardiões', emoji: '🐉' },
    { id: 'leaderboard', label: 'Ranking', emoji: '🏆' },
  ];

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'DragonMaster', level: 42, wins: 156, element: 'fire' as Element, isPlayer: false },
    { rank: 2, name: 'IceQueen', level: 38, wins: 142, element: 'ice' as Element, isPlayer: false },
    { rank: 3, name: 'ThunderGod', level: 35, wins: 128, element: 'lightning' as Element, isPlayer: false },
    { rank: 4, name: 'WindWalker', level: 31, wins: 98, element: 'wind' as Element, isPlayer: false },
    { rank: 5, name: 'ShadowNinja', level: 28, wins: 87, element: 'darkness' as Element, isPlayer: false },
    { rank: 6, name: 'LightBearer', level: 25, wins: 76, element: 'light' as Element, isPlayer: false },
    { rank: 7, name: 'Você', level: stats.level, wins: stats.wins, element: (stats.elementStats.fire.games > 0 ? 'fire' : 'lightning') as Element, isPlayer: true },
    { rank: 8, name: 'FireStorm', level: 20, wins: 54, element: 'fire' as Element, isPlayer: false },
    { rank: 9, name: 'FrostByte', level: 18, wins: 45, element: 'ice' as Element, isPlayer: false },
    { rank: 10, name: 'BoltRunner', level: 15, wins: 38, element: 'lightning' as Element, isPlayer: false },
  ];

  return (
    <main className="game-bg min-h-screen">
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-3 sm:p-4 border-b border-amber-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto">
            {/* Logo Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Official Logo */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden ring-2 ring-amber-500/50">
                  <Image
                    src="/logo-game.png"
                    alt="XIXIBOLA PRIME"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-black game-title">
                    XIXIBOLA PRIME
                  </h1>
                  <p className="text-[9px] sm:text-xs text-muted-foreground hidden sm:block">
                    Elemental Strategy Arena
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Nível</p>
                  <p className="text-lg font-bold text-amber-400">{stats.level}</p>
                </div>
                <div className="flex items-center gap-1 bg-black/30 rounded-lg px-2 sm:px-3 py-1">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-sm font-bold">{stats.wins}</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'play') {
                      setGameStarted(false);
                      setGameMode(null);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-black/20 text-muted-foreground hover:bg-black/30 border border-transparent'
                  )}
                >
                  <span>{tab.emoji}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Play Tab */}
            {activeTab === 'play' && !gameStarted && (
              <div className="space-y-6 animate-fade-in">
                {/* Hero */}
                <div className="text-center space-y-3 py-4 sm:py-6">
                  {/* Large Logo */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto relative rounded-2xl overflow-hidden ring-4 ring-amber-500/50 shadow-xl shadow-amber-500/20">
                    <Image
                      src="/logo-game.png"
                      alt="XIXIBOLA PRIME"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 animate-pulse-slow">
                    <span>🔥</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-400">
                      Ultimate Tic-Tac-Toe Evoluído
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black game-title leading-tight">
                    XIXIBOLA
                    <br />
                    <span className="text-amber-400">PRIME</span>
                  </h2>

                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Uma arena estratégica onde poderes elementais decidem o destino!
                  </p>
                </div>

                {/* Game Mode Selection */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-500/20">
                  <h3 className="text-center font-bold text-amber-400 mb-4">
                    🎮 Escolha o Modo de Jogo
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* VS AI */}
                    <button
                      onClick={() => setGameMode('ai')}
                      className={cn(
                        'p-4 sm:p-6 rounded-xl border-2 transition-all text-center',
                        gameMode === 'ai'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-black/30 border-amber-500/20 hover:border-amber-500/40'
                      )}
                    >
                      <span className="text-3xl sm:text-4xl block mb-2">🤖</span>
                      <p className="font-bold text-sm sm:text-base">VS IA</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Jogue contra o computador
                      </p>
                    </button>

                    {/* VS Player */}
                    <button
                      onClick={() => setGameMode('pvp')}
                      className={cn(
                        'p-4 sm:p-6 rounded-xl border-2 transition-all text-center',
                        gameMode === 'pvp'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-black/30 border-amber-500/20 hover:border-amber-500/40'
                      )}
                    >
                      <span className="text-3xl sm:text-4xl block mb-2">👥</span>
                      <p className="font-bold text-sm sm:text-base">2 Jogadores</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Jogue com um amigo
                      </p>
                    </button>
                  </div>
                </div>

                {/* Difficulty Selection (only for AI mode) */}
                {gameMode === 'ai' && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-500/20 animate-fade-in">
                    <h3 className="text-center font-bold text-amber-400 mb-4">
                      🤖 Dificuldade da IA
                    </h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { level: 'easy', emoji: '🌱', label: 'Fácil', desc: 'Para iniciantes' },
                        { level: 'medium', emoji: '⚔️', label: 'Médio', desc: 'Desafiador' },
                        { level: 'hard', emoji: '💀', label: 'Difícil', desc: 'Mestre' },
                      ].map((diff) => (
                        <button
                          key={diff.level}
                          onClick={() => setAiDifficulty(diff.level as typeof aiDifficulty)}
                          className={cn(
                            'p-3 sm:p-4 rounded-xl border transition-all text-center',
                            aiDifficulty === diff.level
                              ? diff.level === 'easy'
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : diff.level === 'medium'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-red-500/20 border-red-500 text-red-400'
                              : 'bg-black/30 border-amber-500/20 text-muted-foreground hover:border-amber-500/40'
                          )}
                        >
                          <span className="text-xl sm:text-2xl">{diff.emoji}</span>
                          <p className="font-bold mt-1 text-sm sm:text-base">{diff.label}</p>
                          <p className="text-[10px] opacity-70">{diff.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Play Button */}
                {gameMode && (
                  <div className="text-center animate-fade-in">
                    <Button
                      onClick={() => setGameStarted(true)}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-black font-black text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105"
                    >
                      ⚔️ {gameMode === 'ai' ? 'JOGAR VS IA' : 'JOGAR 2 JOGADORES'}
                    </Button>
                  </div>
                )}

                {/* Feature Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { emoji: '⚡', title: 'Poderes', desc: '6 Elementos' },
                    { emoji: '🎯', title: 'Estratégia', desc: '9 tabuleiros' },
                    { emoji: '🐉', title: 'Guardiões', desc: 'Lendários' },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="bg-black/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-500/20 text-center"
                    >
                      <span className="text-2xl sm:text-3xl">{feature.emoji}</span>
                      <h3 className="font-bold text-amber-400 mt-2 text-xs sm:text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* How to Play */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                  <h3 className="font-bold text-amber-400 mb-3 text-center">📜 Como Jogar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="space-y-1.5">
                      <p>🔸 <strong className="text-white">Tabuleiro Mestre:</strong> 9 quadrados grandes com 3×3 dentro</p>
                      <p>🔸 <strong className="text-white">Regra de Ouro:</strong> Sua jogada determina onde o adversário joga</p>
                    </div>
                    <div className="space-y-1.5">
                      <p>🔸 <strong className="text-white">Vitória:</strong> 3 tabuleiros em linha ou 5 no total</p>
                      <p>🔸 <strong className="text-white">Elementos:</strong> Use poderes estrategicamente</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'play' && gameStarted && gameMode && (
              <div className="animate-fade-in">
                <Game vsAI={gameMode === 'ai'} aiDifficulty={aiDifficulty} />
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-4 animate-fade-in">
                <PlayerProgress stats={stats} />
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="animate-fade-in">
                <AchievementsPanel achievements={achievements} />
              </div>
            )}

            {/* Guardians Tab */}
            {activeTab === 'guardians' && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-400">
                    🐉 Guardiões Elementais
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Coleta e evolua seus guardiões lendários
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GUARDIANS.map((guardian) => (
                    <GuardianCard
                      key={guardian.id}
                      guardian={guardian}
                      unlocked={guardian.rarity === 'common' || guardian.rarity === 'rare'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="animate-fade-in">
                <Leaderboard entries={leaderboardData} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-3 border-t border-amber-500/20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              🎮 XIXIBOLA PRIME • Elemental Strategy Arena • {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <Tutorial onComplete={completeTutorial} onSkip={skipTutorial} />
      )}
    </main>
  );
}
