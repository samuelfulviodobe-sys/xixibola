'use client';

import { cn } from '@/lib/utils';
import type { CellState } from '@/lib/game/types';

interface CellProps {
  value: CellState;
  onClick: () => void;
  isPartOfActiveBoard: boolean;
  isFrozen: boolean;
  isLastMove: boolean;
  isWinningCell: boolean;
  disabled: boolean;
  isBurnable?: boolean;
}

export function Cell({
  value,
  onClick,
  isPartOfActiveBoard,
  isFrozen,
  isLastMove,
  isWinningCell,
  disabled,
  isBurnable = false,
}: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isFrozen}
      className={cn(
        'game-cell aspect-square rounded-lg',
        'text-center font-bold transition-all duration-200',
        {
          'active-board': isPartOfActiveBoard && !value && !isBurnable,
          'frozen': isFrozen,
          'occupied': value !== null && !isBurnable,
          'ring-2 ring-amber-400': isLastMove,
          'ring-2 ring-green-400 bg-green-500/10': isWinningCell,
          'cursor-not-allowed opacity-50': disabled || isFrozen,
          'hover:scale-105': (!disabled && !isFrozen && !value) || isBurnable,
          // Fire power targeting styles
          'ring-2 ring-red-500 bg-red-500/30 animate-pulse cursor-pointer': isBurnable,
          'hover:bg-red-500/50 hover:ring-4 hover:ring-red-400': isBurnable,
        }
      )}
    >
      {value === 'X' && !isBurnable && (
        <span className="cell-x animate-pulse-subtle">X</span>
      )}
      {value === 'O' && !isBurnable && (
        <span className="cell-o animate-pulse-subtle">O</span>
      )}
      {isBurnable && value && (
        <span className="relative">
          <span className={value === 'X' ? 'cell-x' : 'cell-o'}>{value}</span>
          <span className="absolute -top-1 -right-2 text-xs">🔥</span>
        </span>
      )}
      {!value && !isFrozen && isPartOfActiveBoard && !isBurnable && (
        <span className="text-muted-foreground/30 text-xs opacity-0 hover:opacity-100 transition-opacity">
          •
        </span>
      )}
    </button>
  );
}
