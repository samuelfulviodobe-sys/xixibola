'use client';

import { Cell } from './Cell';
import type { InnerBoard, BoardOwner, InnerPosition, Position } from '@/lib/game/types';
import { cn } from '@/lib/utils';

interface InnerBoardComponentProps {
  board: InnerBoard;
  owner: BoardOwner;
  macroPosition: InnerPosition;
  isActive: boolean;
  isFrozen: boolean;
  isNextTarget: boolean;
  lastMove: Position | null;
  winningCells: Position[];
  onCellClick: (pos: Position) => void;
  disabled: boolean;
  isTargetingFire?: boolean;
  canBurnCell?: (pos: Position) => boolean;
  isTargetingBoard?: boolean;
  canTargetBoard?: boolean;
  targetBoardType?: 'ice' | 'wind' | null;
}

export function InnerBoardComponent({
  board,
  owner,
  macroPosition,
  isActive,
  isFrozen,
  isNextTarget,
  lastMove,
  winningCells,
  onCellClick,
  disabled,
  isTargetingFire = false,
  canBurnCell,
  isTargetingBoard = false,
  canTargetBoard = false,
  targetBoardType = null,
}: InnerBoardComponentProps) {
  const isOwned = owner === 'X' || owner === 'O';
  const isDraw = owner === 'draw';

  // Determine board highlight based on targeting mode
  const getBoardHighlight = () => {
    if (!isTargetingBoard || isOwned || isFrozen) return '';
    if (targetBoardType === 'ice' && canTargetBoard) {
      return 'ring-4 ring-cyan-400/70 ring-inset bg-cyan-500/20 animate-pulse';
    }
    if (targetBoardType === 'wind') {
      return 'ring-4 ring-green-400/70 ring-inset bg-green-500/20 animate-pulse';
    }
    return '';
  };

  return (
    <div
      className={cn(
        'macro-cell rounded-xl p-1.5 sm:p-2 transition-all duration-300',
        {
          'won-x': owner === 'X',
          'won-o': owner === 'O',
          'draw': isDraw,
          'next-target': isNextTarget && !isOwned && !isFrozen,
          'opacity-60': isFrozen,
        },
        getBoardHighlight()
      )}
    >
      {isOwned ? (
        // Show large X or O for owned boards
        <div className="w-full h-full flex items-center justify-center min-h-[80px] sm:min-h-[100px]">
          <span
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl font-black winner-animation',
              {
                'cell-x': owner === 'X',
                'cell-o': owner === 'O',
              }
            )}
          >
            {owner}
          </span>
        </div>
      ) : isDraw ? (
        <div className="w-full h-full flex items-center justify-center min-h-[80px] sm:min-h-[100px]">
          <span className="text-3xl sm:text-4xl opacity-50">—</span>
        </div>
      ) : (
        // Show 3x3 grid
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {board.map((row, innerRow) =>
            row.map((cell, innerCol) => {
              const pos: Position = {
                macroRow: macroPosition.row,
                macroCol: macroPosition.col,
                innerRow,
                innerCol,
              };

              const isLastMoveCell =
                lastMove &&
                lastMove.macroRow === pos.macroRow &&
                lastMove.macroCol === pos.macroCol &&
                lastMove.innerRow === pos.innerRow &&
                lastMove.innerCol === pos.innerCol;

              const isWinningCell = winningCells.some(
                (wc) =>
                  wc.macroRow === pos.macroRow &&
                  wc.macroCol === pos.macroCol &&
                  wc.innerRow === pos.innerRow &&
                  wc.innerCol === pos.innerCol
              );

              // Check if this cell can be burned (Fire power)
              const isBurnable = isTargetingFire && canBurnCell && canBurnCell(pos);

              return (
                <Cell
                  key={`${innerRow}-${innerCol}`}
                  value={cell}
                  onClick={() => onCellClick(pos)}
                  isPartOfActiveBoard={isActive}
                  isFrozen={isFrozen}
                  isLastMove={isLastMoveCell || false}
                  isWinningCell={isWinningCell}
                  disabled={disabled && !isBurnable}
                  isBurnable={isBurnable}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
