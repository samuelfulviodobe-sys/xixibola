'use client';

import { InnerBoardComponent } from './InnerBoard';
import type { GameState, Position, Element } from '@/lib/game/types';

interface MacroBoardProps {
  gameState: GameState;
  onCellClick: (pos: Position) => void;
  onBoardClick?: (macroRow: number, macroCol: number) => void;
  disabled: boolean;
  winningLine: Position[] | null;
  activePower?: Element | null;
  canBurnCell?: (pos: Position) => boolean;
}

export function MacroBoard({
  gameState,
  onCellClick,
  onBoardClick,
  disabled,
  winningLine,
  activePower,
  canBurnCell
}: MacroBoardProps) {
  const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];

  // Check if we're in power targeting mode
  const isTargetingMode = activePower !== null;
  const isFireMode = activePower === 'fire';
  const isIceMode = activePower === 'ice';
  const isWindMode = activePower === 'wind';

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-amber-500/20">
      {gameState.macroBoard.map((macroRow, macroRowIdx) =>
        macroRow.map((innerBoard, macroColIdx) => {
          const macroPosition = { row: macroRowIdx, col: macroColIdx };
          const owner = gameState.macroOwners[macroRowIdx][macroColIdx];

          // Check if this board is the next target
          const isNextTarget =
            gameState.nextBoard?.row === macroRowIdx &&
            gameState.nextBoard?.col === macroColIdx;

          // Check if this board is active (player can play here)
          const isActive =
            gameState.nextBoard === null ||
            isNextTarget;

          // Check if frozen
          const isFrozen = gameState.frozenBoards.some(
            (fb) => fb.row === macroRowIdx && fb.col === macroColIdx
          );

          // Check if this board can be targeted for Ice/Wind
          const canTargetBoard = owner === null && !isFrozen;

          // Get winning cells for this inner board
          const boardWinningCells = winningLine?.filter(
            (wc) => wc.macroRow === macroRowIdx && wc.macroCol === macroColIdx
          ) || [];

          // Determine target board type for styling
          const targetBoardType: 'ice' | 'wind' | null = isIceMode ? 'ice' : isWindMode ? 'wind' : null;

          return (
            <div
              key={`${macroRowIdx}-${macroColIdx}`}
              onClick={() => {
                if ((isIceMode || isWindMode) && onBoardClick) {
                  onBoardClick(macroRowIdx, macroColIdx);
                }
              }}
              className={((isIceMode && canTargetBoard) || isWindMode) ? 'cursor-pointer' : ''}
            >
              <InnerBoardComponent
                board={innerBoard}
                owner={owner}
                macroPosition={macroPosition}
                isActive={isActive && gameState.gameStatus === 'playing'}
                isFrozen={isFrozen}
                isNextTarget={isNextTarget}
                lastMove={lastMove}
                winningCells={boardWinningCells}
                onCellClick={onCellClick}
                disabled={disabled || (!isFireMode && !isActive) || owner !== null}
                isTargetingFire={isFireMode}
                canBurnCell={canBurnCell}
                isTargetingBoard={isIceMode || isWindMode}
                canTargetBoard={canTargetBoard}
                targetBoardType={targetBoardType}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
