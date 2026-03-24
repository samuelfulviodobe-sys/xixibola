'use client';

import { cn } from '@/lib/utils';
import { ELEMENT_COLORS } from '@/lib/game/constants';
import type { GameState } from '@/lib/game/types';

interface GameStatusProps {
  gameState: GameState;
  playerName: string;
  opponentName: string;
  vsAI: boolean;
}

export function GameStatus({ gameState, playerName, opponentName, vsAI }: GameStatusProps) {
  const playerXElement = gameState.playerXElement;
  const playerOElement = gameState.playerOElement;

  const xColor = playerXElement ? ELEMENT_COLORS[playerXElement].primary : '#ff4d00';
  const oColor = playerOElement ? ELEMENT_COLORS[playerOElement].primary : '#00d4ff';

  const isXTurn = gameState.currentPlayer === 'X';
  const isGameFinished = gameState.gameStatus === 'finished';

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
      {/* Game Status Header */}
      <div className="text-center mb-4">
        {isGameFinished ? (
          <div className="space-y-2">
            {gameState.winner && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black game-title">
                  🏆 VITÓRIA!
                </h2>
                <p className={cn(
                  'text-xl sm:text-2xl font-bold',
                  gameState.winner === 'X' ? 'text-orange-400' : 'text-cyan-400'
                )}>
                  {gameState.winner === 'X' ? playerName : opponentName} Venceu!
                </p>
              </>
            )}
            {gameState.winner === 'draw' && (
              <h2 className="text-2xl sm:text-3xl font-black text-gray-400">
                ⚖️ EMPATE!
              </h2>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Turno atual</p>
            <h2 className={cn(
              'text-xl sm:text-2xl font-black animate-pulse',
              isXTurn ? 'text-orange-400' : 'text-cyan-400'
            )}>
              {isXTurn ? playerName : opponentName}
              <span className="ml-2 text-lg">
                {isXTurn ? '(X)' : '(O)'}
              </span>
            </h2>
          </div>
        )}
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Player X */}
        <div className={cn(
          'p-3 rounded-xl transition-all duration-300',
          isXTurn && !isGameFinished
            ? 'bg-orange-500/20 ring-2 ring-orange-500/50'
            : 'bg-black/30'
        )}>
          <p className="text-xs text-muted-foreground mb-1">{playerName}</p>
          <p className="text-2xl font-black" style={{ color: xColor }}>
            {gameState.capturedBoardsX}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">tabuleiros</p>
        </div>

        {/* VS */}
        <div className="p-3 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-amber-400">VS</span>
          <span className="text-[10px] text-muted-foreground">
            Jogada {gameState.moveCount}
          </span>
        </div>

        {/* Player O */}
        <div className={cn(
          'p-3 rounded-xl transition-all duration-300',
          !isXTurn && !isGameFinished
            ? 'bg-cyan-500/20 ring-2 ring-cyan-500/50'
            : 'bg-black/30'
        )}>
          <p className="text-xs text-muted-foreground mb-1">{opponentName}</p>
          <p className="text-2xl font-black" style={{ color: oColor }}>
            {gameState.capturedBoardsO}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">tabuleiros</p>
        </div>
      </div>

      {/* Next Board Indicator */}
      {!isGameFinished && gameState.nextBoard && (
        <div className="mt-3 text-center">
          <p className="text-xs text-amber-400">
            📍 Próximo: Tabuleiro ({gameState.nextBoard.row + 1}, {gameState.nextBoard.col + 1})
          </p>
        </div>
      )}

      {!isGameFinished && !gameState.nextBoard && (
        <div className="mt-3 text-center">
          <p className="text-xs text-green-400">
            ✨ Jogada livre! Escolha qualquer tabuleiro
          </p>
        </div>
      )}

      {/* AI Badge */}
      {vsAI && (
        <div className="mt-3 text-center">
          <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
            🤖 Jogando contra IA
          </span>
        </div>
      )}
    </div>
  );
}
