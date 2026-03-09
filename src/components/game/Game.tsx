'use client';

import { useState, useCallback } from 'react';
import { MacroBoard } from './MacroBoard';
import { ElementalSelector } from './ElementalSelector';
import { PowerPanel } from './PowerPanel';
import { GameStatus } from './GameStatus';
import {
  createInitialGameState,
  makeMove,
  isValidMove,
  getAIMove,
  hasDoubleTurn,
  activatePower,
} from '@/lib/game/engine';
import { ELEMENTAL_POWERS } from '@/lib/game/constants';
import type { GameState, Position, Element, InnerPosition } from '@/lib/game/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameProps {
  vsAI?: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

type SelectionPhase = 'player-x' | 'player-o' | 'ready';

// Helper: Get random element for AI
function getRandomAIElement(): Element {
  const elements: Element[] = ['fire', 'ice', 'lightning', 'wind', 'darkness', 'light'];
  return elements[Math.floor(Math.random() * elements.length)];
}

export function Game({ vsAI = true, aiDifficulty = 'medium' }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [playerXElement, setPlayerXElement] = useState<Element | null>(null);
  const [playerOElement, setPlayerOElement] = useState<Element | null>(null);
  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>('player-x');
  const [showVictory, setShowVictory] = useState(false);
  const [winningLine, setWinningLine] = useState<Position[] | null>(null);
  const [powerMessage, setPowerMessage] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  // Find winning line for animation - declared first
  const handleFindWinningLine = useCallback(() => {
    setWinningLine(null);
  }, []);

  // Phase 1: Element Selection
  const handleSelectElement = (element: Element) => {
    if (selectionPhase === 'player-x') {
      setPlayerXElement(element);
    } else if (selectionPhase === 'player-o') {
      setPlayerOElement(element);
    }
  };

  const handleConfirmElement = () => {
    if (selectionPhase === 'player-x') {
      if (vsAI) {
        // AI mode - auto select AI element and start
        const aiElement = getRandomAIElement();
        const aiPower = ELEMENTAL_POWERS.find((p) => p.id === aiElement);
        const playerPower = ELEMENTAL_POWERS.find((p) => p.id === playerXElement);

        setGameState((prev) => ({
          ...prev,
          gameStatus: 'playing',
          playerXElement: playerXElement,
          playerOElement: aiElement,
          playerXPowers: new Map(playerXElement && playerPower ? [[playerXElement, playerPower.maxUses]] : []),
          playerOPowers: new Map(aiPower ? [[aiElement, aiPower.maxUses]] : []),
        }));
      } else {
        // PvP mode - go to player O selection
        setSelectionPhase('player-o');
      }
    } else if (selectionPhase === 'player-o') {
      // PvP mode - start game
      const playerXPower = ELEMENTAL_POWERS.find((p) => p.id === playerXElement);
      const playerOPower = ELEMENTAL_POWERS.find((p) => p.id === playerOElement);

      setGameState((prev) => ({
        ...prev,
        gameStatus: 'playing',
        playerXElement: playerXElement,
        playerOElement: playerOElement,
        playerXPowers: new Map(playerXElement && playerXPower ? [[playerXElement, playerXPower.maxUses]] : []),
        playerOPowers: new Map(playerOElement && playerOPower ? [[playerOElement, playerOPower.maxUses]] : []),
      }));
    }
  };

  // Reset game
  const handleResetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setPlayerXElement(null);
    setPlayerOElement(null);
    setSelectionPhase('player-x');
    setShowVictory(false);
    setWinningLine(null);
    setIsProcessing(false);
    setPowerMessage(null);
  }, [setIsProcessing]);

  // ============================================
  // POWER ACTIVATION HANDLERS
  // ============================================

  // Handle power activation
  const handleActivatePower = useCallback((element: Element) => {
    const playerPowers = gameState.currentPlayer === 'X' ? gameState.playerXPowers : gameState.playerOPowers;
    const uses = playerPowers.get(element) || 0;

    if (uses <= 0) {
      setPowerMessage('❌ Sem usos restantes!');
      setTimeout(() => setPowerMessage(null), 2000);
      return;
    }

    // Different handling based on power type
    switch (element) {
      case 'lightning':
        // Lightning: Immediately activate - double turn
        const newState = activatePower(gameState, element);
        setGameState(newState);
        setPowerMessage('⚡ RAIO ATIVADO! Jogue duas vezes!');
        setTimeout(() => setPowerMessage(null), 3000);
        break;

      case 'darkness':
        // Darkness: Immediately activate - hide next moves
        const darknessState = activatePower(gameState, element);
        setGameState(darknessState);
        setPowerMessage('🌑 TREVAS ATIVADAS! Seus movimentos estão ocultos!');
        setTimeout(() => setPowerMessage(null), 3000);
        break;

      case 'light':
        // Light: Immediately activate - reveal best move
        const lightState = activatePower(gameState, element);
        setGameState(lightState);
        setPowerMessage('🌕 LUZ ATIVADA! A melhor jogada será revelada!');
        setTimeout(() => setPowerMessage(null), 3000);
        break;

      case 'fire':
        // Fire: Needs to select opponent's cell to burn
        setGameState((prev) => ({ ...prev, activePower: element }));
        setPowerMessage('🔥 Clique em uma célula do ADVERSÁRIO para queimar!');
        break;

      case 'ice':
        // Ice: Needs to select a board to freeze
        setGameState((prev) => ({ ...prev, activePower: element }));
        setPowerMessage('❄️ Clique em um TABULEIRO para congelar!');
        break;

      case 'wind':
        // Wind: Needs to select a board to redirect to
        setGameState((prev) => ({ ...prev, activePower: element }));
        setPowerMessage('🌪️ Clique em um TABULEIRO para redirecionar!');
        break;
    }
  }, [gameState]);

  // Cancel power activation
  const handleCancelPower = useCallback(() => {
    setGameState((prev) => ({ ...prev, activePower: null }));
    setPowerMessage(null);
  }, []);

  // Check if a cell can be burned (Fire power)
  const canBurnCell = useCallback((pos: Position): boolean => {
    const cell = gameState.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol];
    const opponent = gameState.currentPlayer === 'X' ? 'O' : 'X';
    return cell === opponent;
  }, [gameState]);

  // Check if a board can be frozen (Ice power)
  const canFreezeBoard = useCallback((macroRow: number, macroCol: number): boolean => {
    // Board must not be owned yet
    if (gameState.macroOwners[macroRow][macroCol] !== null) return false;
    // Board must not already be frozen
    const isFrozen = gameState.frozenBoards.some(fb => fb.row === macroRow && fb.col === macroCol);
    return !isFrozen;
  }, [gameState]);

  // Handle power target selection
  const handlePowerTargetSelect = useCallback((pos: Position | InnerPosition) => {
    if (!gameState.activePower) return;

    const element = gameState.activePower;

    if (element === 'fire' && 'innerRow' in pos) {
      // Fire: Burn opponent's cell
      const cell = gameState.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol];
      if (cell && cell !== gameState.currentPlayer) {
        const newState = activatePower(gameState, element, pos);
        setGameState({ ...newState, activePower: null });
        setPowerMessage('🔥 Célula QUEIMADA com sucesso!');
        setTimeout(() => setPowerMessage(null), 2000);
      } else {
        setPowerMessage('❌ Selecione uma célula do ADVERSÁRIO!');
        setTimeout(() => setPowerMessage(null), 2000);
      }
    } else if (element === 'ice' && !('innerRow' in pos)) {
      // Ice: Freeze board
      if (canFreezeBoard(pos.row, pos.col)) {
        const newState = activatePower(gameState, element, pos);
        setGameState({ ...newState, activePower: null });
        setPowerMessage('❄️ Tabuleiro CONGELADO!');
        setTimeout(() => setPowerMessage(null), 2000);
      } else {
        setPowerMessage('❌ Este tabuleiro não pode ser congelado!');
        setTimeout(() => setPowerMessage(null), 2000);
      }
    } else if (element === 'wind' && !('innerRow' in pos)) {
      // Wind: Redirect to board
      const newState = activatePower(gameState, element, pos);
      setGameState({ ...newState, activePower: null });
      setPowerMessage('🌪️ Adversário redirecionado!');
      setTimeout(() => setPowerMessage(null), 2000);
    }
  }, [gameState, canFreezeBoard]);

  // Handle board click for Ice/Wind powers
  const handleBoardClick = useCallback((macroRow: number, macroCol: number) => {
    if (!gameState.activePower) return;

    if (gameState.activePower === 'ice') {
      if (canFreezeBoard(macroRow, macroCol)) {
        handlePowerTargetSelect({ row: macroRow, col: macroCol });
      }
    } else if (gameState.activePower === 'wind') {
      handlePowerTargetSelect({ row: macroRow, col: macroCol });
    }
  }, [gameState, canFreezeBoard, handlePowerTargetSelect]);

  // Trigger AI move
  const triggerAIMove = useCallback((currentState: GameState) => {
    if (currentState.gameStatus !== 'playing') return;
    if (currentState.currentPlayer !== 'O') return;

    setIsProcessing(true);

    setTimeout(() => {
      const aiMove = getAIMove(currentState, aiDifficulty);
      if (aiMove) {
        const aiState = makeMove(currentState, aiMove);
        setGameState(aiState);

        if (aiState.gameStatus === 'finished') {
          setShowVictory(true);
          handleFindWinningLine();
          setIsProcessing(false);
          return;
        }

        // Check if AI has double turn and needs to play again
        const aiHasDouble = hasDoubleTurn(aiState, 'O');
        if (aiHasDouble) {
          // AI plays again after a shorter delay
          setTimeout(() => {
            const secondMove = getAIMove(aiState, aiDifficulty);
            if (secondMove) {
              const secondState = makeMove(aiState, secondMove);
              setGameState(secondState);

              if (secondState.gameStatus === 'finished') {
                setShowVictory(true);
                handleFindWinningLine();
              }
            }
            setIsProcessing(false);
          }, 400);
          return;
        }
      }
      setIsProcessing(false);
    }, 600);
  }, [aiDifficulty, handleFindWinningLine, setIsProcessing]);

  // Phase 2: Game Play - Handle cell click
  const handleCellClick = useCallback(
    (pos: Position) => {
      // If a power is active, handle power target selection
      if (gameState.activePower === 'fire') {
        handlePowerTargetSelect(pos);
        return;
      }

      if (isProcessing || gameState.gameStatus !== 'playing') return;
      if (!isValidMove(gameState, pos)) return;

      setIsProcessing(true);

      const newState = makeMove(gameState, pos);
      setGameState(newState);

      // Check for victory
      if (newState.gameStatus === 'finished') {
        setShowVictory(true);
        handleFindWinningLine();
        setIsProcessing(false);
        return;
      }

      // Handle double turn (Lightning power)
      const hasDouble = hasDoubleTurn(newState, gameState.currentPlayer);

      if (!hasDouble) {
        // If AI's turn, trigger AI move after a delay
        if (vsAI && newState.currentPlayer === 'O') {
          // Use setTimeout to avoid calling setState in render phase
          setTimeout(() => {
            triggerAIMove(newState);
          }, 100);
          return;
        }
      } else {
        // Player has double turn - show message
        setPowerMessage('⚡ Dupla jogada! Jogue novamente!');
        setTimeout(() => setPowerMessage(null), 2000);
      }

      setIsProcessing(false);
    },
    [gameState, isProcessing, vsAI, handleFindWinningLine, handlePowerTargetSelect, setIsProcessing, triggerAIMove]
  );

  const selectedElement = selectionPhase === 'player-x' ? playerXElement : playerOElement;

  // Render based on game status
  if (gameState.gameStatus === 'selecting_elements') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black game-title">
            XIXIBOLA PRIME
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {vsAI
              ? 'Escolha seu Elemento Elemental'
              : selectionPhase === 'player-x'
                ? '🎁 Jogador X - Escolha seu Elemento'
                : '🎮 Jogador O - Escolha seu Elemento'}
          </p>
        </div>

        {/* Player indicator for PvP */}
        {!vsAI && (
          <div className="flex justify-center gap-4">
            <div className={cn(
              'px-4 py-2 rounded-xl border-2 transition-all',
              selectionPhase === 'player-x'
                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                : 'bg-black/20 border-white/10 text-muted-foreground'
            )}>
              <span className="text-xl font-bold">X</span>
              <span className="ml-2 text-sm">{playerXElement ? ELEMENTAL_POWERS.find(p => p.id === playerXElement)?.emoji : '❓'}</span>
            </div>
            <div className={cn(
              'px-4 py-2 rounded-xl border-2 transition-all',
              selectionPhase === 'player-o'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-black/20 border-white/10 text-muted-foreground'
            )}>
              <span className="text-xl font-bold">O</span>
              <span className="ml-2 text-sm">{playerOElement ? ELEMENTAL_POWERS.find(p => p.id === playerOElement)?.emoji : '❓'}</span>
            </div>
          </div>
        )}

        {/* Element Selection */}
        <div className="space-y-4">
          <ElementalSelector
            selectedElement={selectedElement}
            onSelect={handleSelectElement}
          />

          {/* Selected Element Info */}
          {selectedElement && (
            <div className="text-center space-y-4 animate-fade-in">
              <p className="text-lg font-bold text-amber-400">
                {vsAI ? 'Você escolheu: ' : selectionPhase === 'player-x' ? 'Jogador X escolheu: ' : 'Jogador O escolheu: '}
                {ELEMENTAL_POWERS.find((p) => p.id === selectedElement)?.emoji}{' '}
                {ELEMENTAL_POWERS.find((p) => p.id === selectedElement)?.name}
              </p>
              <Button
                onClick={handleConfirmElement}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-8 py-6 text-lg"
              >
                {vsAI
                  ? '⚔️ Começar Batalha!'
                  : selectionPhase === 'player-x'
                    ? '➡️ Próximo Jogador'
                    : '⚔️ Começar Batalha!'}
              </Button>
            </div>
          )}
        </div>

        {/* Game Rules */}
        <div className="bg-black/30 rounded-xl p-4 border border-amber-500/20">
          <h3 className="font-bold text-amber-400 mb-3">📜 Como Jogar</h3>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
            <li>• Cada quadrado grande contém um tabuleiro 3×3 interno</li>
            <li>• Sua jogada determina onde o adversário deve jogar</li>
            <li>• Conquiste 3 tabuleiros em linha ou 5 no total para vencer</li>
            <li>• Use seu poder elemental estrategicamente!</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Power Message */}
      {powerMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-black/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-500/50 shadow-lg shadow-amber-500/20">
            <p className="text-lg font-bold text-amber-400 text-center whitespace-nowrap">
              {powerMessage}
            </p>
          </div>
        </div>
      )}

      {/* Game Status */}
      <GameStatus
        gameState={gameState}
        playerName={vsAI ? 'Você' : 'Jogador X'}
        opponentName={vsAI ? 'IA' : 'Jogador O'}
        vsAI={vsAI}
      />

      {/* Main Board */}
      <MacroBoard
        gameState={gameState}
        onCellClick={handleCellClick}
        onBoardClick={handleBoardClick}
        disabled={isProcessing || (vsAI && gameState.currentPlayer === 'O')}
        winningLine={winningLine}
        activePower={gameState.activePower}
        canBurnCell={canBurnCell}
      />

      {/* Power Panel */}
      <PowerPanel
        gameState={gameState}
        currentPlayer={gameState.currentPlayer}
        onActivatePower={handleActivatePower}
        onCancelPower={handleCancelPower}
      />

      {/* Victory Overlay */}
      {showVictory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="animate-bounce">
              {gameState.winner === 'X' ? (
                <span className="text-8xl">🏆</span>
              ) : gameState.winner === 'O' ? (
                <span className="text-8xl">{vsAI ? '🤖' : '🏆'}</span>
              ) : (
                <span className="text-8xl">⚖️</span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black game-title">
              {gameState.winner === 'X' && (vsAI ? 'VOCÊ VENCEU!' : 'JOGADOR X VENCEU!')}
              {gameState.winner === 'O' && (vsAI ? 'A IA VENCEU!' : 'JOGADOR O VENCEU!')}
              {gameState.winner === 'draw' && 'EMPATE!'}
            </h2>

            <p className="text-muted-foreground">
              {gameState.winner === 'X' && '🎉 Parabéns! Você dominou a arena!'}
              {gameState.winner === 'O' && (vsAI ? '💪 Treine mais e tente novamente!' : '🎉 Parabéns! Vitória espetacular!')}
              {gameState.winner === 'draw' && '🤝 Uma batalha equilibrada!'}
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleResetGame}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold"
              >
                🔄 Jogar Novamente
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-500/20">
              <div>
                <p className="text-2xl font-bold text-orange-400">{gameState.capturedBoardsX}</p>
                <p className="text-xs text-muted-foreground">{vsAI ? 'Seus' : 'X'} Tabuleiros</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{gameState.moveCount}</p>
                <p className="text-xs text-muted-foreground">Jogadas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">{gameState.capturedBoardsO}</p>
                <p className="text-xs text-muted-foreground">{vsAI ? 'IA' : 'O'} Tabuleiros</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleResetGame}
          variant="outline"
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          🔄 Novo Jogo
        </Button>
      </div>
    </div>
  );
}
