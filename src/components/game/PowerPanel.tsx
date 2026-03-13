'use client';

import { cn } from '@/lib/utils';
import { ELEMENTAL_POWERS, ELEMENT_COLORS } from '@/lib/game/constants';
import type { Element, GameState } from '@/lib/game/types';

interface PowerPanelProps {
  gameState: GameState;
  currentPlayer: 'X' | 'O';
  onActivatePower: (element: Element) => void;
  onCancelPower: () => void;
}

export function PowerPanel({ gameState, currentPlayer, onActivatePower, onCancelPower }: PowerPanelProps) {
  const powers = currentPlayer === 'X' ? gameState.playerXPowers : gameState.playerOPowers;
  const playerElement = currentPlayer === 'X' ? gameState.playerXElement : gameState.playerOElement;

  if (!playerElement) return null;

  const availablePowers = ELEMENTAL_POWERS.filter((p) => p.id === playerElement);
  const usesRemaining = powers.get(playerElement) || 0;
  const isActive = gameState.activePower !== null;

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-500/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-amber-400">
          ⚡ Poderes Elementais
        </h3>
        {isActive && (
          <button
            onClick={onCancelPower}
            className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="flex gap-3">
        {availablePowers.map((power) => {
          const colors = ELEMENT_COLORS[power.id];
          const canUse = usesRemaining > 0 && !isActive && gameState.gameStatus === 'playing';

          return (
            <button
              key={power.id}
              onClick={() => canUse && onActivatePower(power.id)}
              disabled={!canUse}
              className={cn(
                'power-card flex-1 flex flex-col items-center gap-2',
                { 'active': gameState.activePower === power.id }
              )}
              style={{
                borderColor: isActive ? colors.primary : undefined,
              }}
            >
              <span className="text-2xl sm:text-3xl">{power.emoji}</span>
              <div className="text-center">
                <p
                  className="text-xs sm:text-sm font-bold"
                  style={{ color: colors.primary }}
                >
                  {power.name}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {usesRemaining}/{power.maxUses} usos
                </p>
              </div>

              {/* Progress bar for uses */}
              <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(usesRemaining / power.maxUses) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Power description */}
      {isActive && (
        <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs text-amber-300 text-center">
            {ELEMENTAL_POWERS.find((p) => p.id === gameState.activePower)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
