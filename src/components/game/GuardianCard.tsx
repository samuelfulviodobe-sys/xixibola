'use client';

import { cn } from '@/lib/utils';
import { GUARDIANS, ELEMENT_COLORS } from '@/lib/game/constants';
import type { Guardian, Element } from '@/lib/game/types';

interface GuardianCardProps {
  guardian: Guardian;
  isSelected?: boolean;
  onSelect?: () => void;
  unlocked?: boolean;
  compact?: boolean;
}

export function GuardianCard({
  guardian,
  isSelected,
  onSelect,
  unlocked = true,
  compact = false,
}: GuardianCardProps) {
  const colors = ELEMENT_COLORS[guardian.element];
  const rarityColors = {
    common: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    legendary: 'from-amber-500/20 to-yellow-600/20 border-amber-500/30',
  };

  if (compact) {
    return (
      <button
        onClick={onSelect}
        disabled={!unlocked}
        className={cn(
          'relative p-3 rounded-xl transition-all duration-300',
          'bg-gradient-to-br',
          rarityColors[guardian.rarity],
          'border-2',
          {
            'opacity-50 cursor-not-allowed': !unlocked,
            'hover:scale-105 cursor-pointer': unlocked,
            'ring-2 ring-amber-400': isSelected,
          }
        )}
      >
        <span className="text-2xl">{guardian.emoji}</span>
        {guardian.level > 1 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {guardian.level}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        'guardian-card cursor-pointer',
        'bg-gradient-to-br',
        rarityColors[guardian.rarity],
        { 'opacity-50 cursor-not-allowed': !unlocked },
        { 'ring-2 ring-amber-400 scale-105': isSelected }
      )}
    >
      {/* Header with emoji and level */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-4xl drop-shadow-lg">{guardian.emoji}</span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full uppercase font-bold',
              'bg-black/30'
            )}
            style={{ color: colors.primary }}
          >
            {guardian.rarity}
          </span>
          {guardian.level > 1 && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              Lv.{guardian.level}
            </span>
          )}
        </div>
      </div>

      {/* Name and element */}
      <h3 className="text-lg font-bold text-white mb-1">{guardian.name}</h3>
      <p
        className="text-sm font-medium mb-3"
        style={{ color: colors.primary }}
      >
        {guardian.description}
      </p>

      {/* Bonus */}
      <div className="bg-black/30 rounded-lg p-2">
        <p className="text-xs text-muted-foreground">
          <span className="text-amber-400">⚡ Bônus:</span> {guardian.bonus}
        </p>
      </div>

      {/* XP Bar */}
      {unlocked && guardian.level < 10 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>XP</span>
            <span>{guardian.evolutionStage}/100</span>
          </div>
          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${guardian.evolutionStage}%`,
                backgroundColor: colors.primary,
              }}
            />
          </div>
        </div>
      )}

      {/* Lock overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <span className="text-3xl">🔒</span>
        </div>
      )}
    </div>
  );
}

// Guardian selection panel
interface GuardianSelectorProps {
  selectedGuardian: Guardian | null;
  onSelect: (guardian: Guardian) => void;
  unlockedGuardians: string[];
}

export function GuardianSelector({
  selectedGuardian,
  onSelect,
  unlockedGuardians,
}: GuardianSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-amber-400 text-center">
        🐉 Escolha seu Guardião
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {GUARDIANS.map((guardian) => (
          <GuardianCard
            key={guardian.id}
            guardian={guardian}
            isSelected={selectedGuardian?.id === guardian.id}
            onSelect={() => onSelect(guardian)}
            unlocked={unlockedGuardians.includes(guardian.id)}
          />
        ))}
      </div>
    </div>
  );
}
