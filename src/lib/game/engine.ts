// XIXIBOLA PRIME - Game Engine
import type { GameState, InnerBoard, MacroBoard, MacroOwners, Position, InnerPosition, BoardOwner, CellState, Element, ActiveEffect } from './types';
import { WIN_PATTERNS, XP_REWARDS } from './constants';

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

// Criar tabuleiro interno vazio
export function createEmptyInnerBoard(): InnerBoard {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

// Criar tabuleiro macro vazio
export function createEmptyMacroBoard(): MacroBoard {
  return [
    [createEmptyInnerBoard(), createEmptyInnerBoard(), createEmptyInnerBoard()],
    [createEmptyInnerBoard(), createEmptyInnerBoard(), createEmptyInnerBoard()],
    [createEmptyInnerBoard(), createEmptyInnerBoard(), createEmptyInnerBoard()],
  ];
}

// Criar macro owners vazio
export function createEmptyMacroOwners(): MacroOwners {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

// Criar estado inicial do jogo
export function createInitialGameState(): GameState {
  return {
    macroBoard: createEmptyMacroBoard(),
    macroOwners: createEmptyMacroOwners(),
    currentPlayer: 'X',
    nextBoard: null,
    playerXElement: null,
    playerOElement: null,
    playerXPowers: new Map(),
    playerOPowers: new Map(),
    activeEffects: [],
    moveHistory: [],
    gameStatus: 'selecting_elements',
    winner: null,
    moveCount: 0,
    capturedBoardsX: 0,
    capturedBoardsO: 0,
    activePower: null,
    frozenBoards: [],
    hiddenCells: [],
  };
}

// ============================================
// LÓGICA DE VERIFICAÇÃO
// ============================================

// Verificar se alguém venceu um tabuleiro interno
export function checkInnerBoardWinner(board: InnerBoard): BoardOwner {
  for (const pattern of WIN_PATTERNS) {
    const [[r1, c1], [r2, c2], [r3, c3]] = pattern;
    const cell1 = board[r1][c1];
    const cell2 = board[r2][c2];
    const cell3 = board[r3][c3];
    
    if (cell1 && cell1 === cell2 && cell2 === cell3) {
      return cell1;
    }
  }
  
  // Verificar empate (tabuleiro cheio)
  const isFull = board.every(row => row.every(cell => cell !== null));
  if (isFull) return 'draw';
  
  return null;
}

// Verificar se alguém venceu o tabuleiro macro
export function checkMacroWinner(owners: MacroOwners): BoardOwner {
  for (const pattern of WIN_PATTERNS) {
    const [[r1, c1], [r2, c2], [r3, c3]] = pattern;
    const owner1 = owners[r1][c1];
    const owner2 = owners[r2][c2];
    const owner3 = owners[r3][c3];
    
    if (owner1 && owner1 === owner2 && owner2 === owner3 && owner1 !== 'draw') {
      return owner1;
    }
  }
  
  return null;
}

// Contar tabuleiros dominados por cada jogador
export function countCapturedBoards(owners: MacroOwners): { X: number; O: number } {
  let countX = 0;
  let countO = 0;
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (owners[row][col] === 'X') countX++;
      if (owners[row][col] === 'O') countO++;
    }
  }
  
  return { X: countX, O: countO };
}

// Verificar condição de vitória especial (5 tabuleiros)
export function checkFiveBoardWin(owners: MacroOwners): 'X' | 'O' | null {
  const { X, O } = countCapturedBoards(owners);
  if (X >= 5) return 'X';
  if (O >= 5) return 'O';
  return null;
}

// Verificar se a jogada é válida
export function isValidMove(state: GameState, pos: Position): boolean {
  // Verificar se o jogo está ativo
  if (state.gameStatus !== 'playing') return false;
  
  // Verificar limites
  if (pos.macroRow < 0 || pos.macroRow > 2) return false;
  if (pos.macroCol < 0 || pos.macroCol > 2) return false;
  if (pos.innerRow < 0 || pos.innerRow > 2) return false;
  if (pos.innerCol < 0 || pos.innerCol > 2) return false;
  
  // Verificar se o tabuleiro interno já foi conquistado
  if (state.macroOwners[pos.macroRow][pos.macroCol] !== null) return false;
  
  // Verificar se a célula está ocupada
  if (state.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol] !== null) return false;
  
  // Verificar se está congelado
  const isFrozen = state.frozenBoards.some(
    fb => fb.row === pos.macroRow && fb.col === pos.macroCol
  );
  if (isFrozen) return false;
  
  // Se há um próximo tabuleiro obrigatório, verificar se a jogada está nele
  if (state.nextBoard) {
    if (pos.macroRow !== state.nextBoard.row || pos.macroCol !== state.nextBoard.col) {
      // Verificar se o tabuleiro obrigatório está disponível
      const targetOwner = state.macroOwners[state.nextBoard.row][state.nextBoard.col];
      const targetFrozen = state.frozenBoards.some(
        fb => fb.row === state.nextBoard!.row && fb.col === state.nextBoard!.col
      );
      
      if (targetOwner === null && !targetFrozen) {
        return false;
      }
      // Se o tabuleiro alvo não está disponível, pode jogar em qualquer lugar
    }
  }
  
  return true;
}

// ============================================
// LÓGICA DE JOGADAS
// ============================================

// Executar uma jogada
export function makeMove(state: GameState, pos: Position): GameState {
  if (!isValidMove(state, pos)) {
    return state;
  }
  
  const newState = deepCloneState(state);
  
  // Fazer a jogada
  newState.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol] = state.currentPlayer;
  newState.moveHistory.push(pos);
  newState.moveCount++;
  
  // Verificar se conquistou o tabuleiro interno
  const innerWinner = checkInnerBoardWinner(newState.macroBoard[pos.macroRow][pos.macroCol]);
  if (innerWinner && innerWinner !== 'draw') {
    newState.macroOwners[pos.macroRow][pos.macroCol] = innerWinner;
    if (innerWinner === 'X') newState.capturedBoardsX++;
    else newState.capturedBoardsO++;
  } else if (innerWinner === 'draw') {
    newState.macroOwners[pos.macroRow][pos.macroCol] = 'draw';
  }
  
  // Determinar próximo tabuleiro
  const nextBoardPos: InnerPosition = { row: pos.innerRow, col: pos.innerCol };
  const nextBoardOwner = newState.macroOwners[nextBoardPos.row][nextBoardPos.col];
  const nextBoardFrozen = newState.frozenBoards.some(
    fb => fb.row === nextBoardPos.row && fb.col === nextBoardPos.col
  );
  
  // Se o próximo tabuleiro está disponível, é obrigatório
  if (nextBoardOwner === null && !nextBoardFrozen) {
    newState.nextBoard = nextBoardPos;
  } else {
    // Se não está disponível, pode jogar em qualquer lugar
    newState.nextBoard = null;
  }
  
  // Verificar vitória
  const macroWinner = checkMacroWinner(newState.macroOwners);
  const fiveBoardWinner = checkFiveBoardWin(newState.macroOwners);

  if (macroWinner) {
    newState.winner = macroWinner;
    newState.gameStatus = 'finished';
  } else if (fiveBoardWinner) {
    newState.winner = fiveBoardWinner;
    newState.gameStatus = 'finished';
  } else {
    // Check for double turn effect (Lightning power)
    const doubleTurnEffect = newState.activeEffects.find(
      e => e.type === 'double_turn' && e.player === state.currentPlayer && e.turnsRemaining > 0
    );

    if (doubleTurnEffect) {
      // Consume the double turn effect - player plays again!
      doubleTurnEffect.turnsRemaining = 0;
      newState.activeEffects = newState.activeEffects.filter(e => e.turnsRemaining > 0);
      // Do NOT switch player - they play again
    } else {
      // Trocar jogador
      newState.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

      // Atualizar efeitos
      updateEffects(newState);
    }
  }

  return newState;
}

// Atualizar efeitos ativos
function updateEffects(state: GameState): void {
  // Reduzir duração dos efeitos
  state.activeEffects = state.activeEffects.filter(effect => {
    effect.turnsRemaining--;
    return effect.turnsRemaining > 0;
  });
  
  // Remover tabuleiros congelados expirados
  state.frozenBoards = state.frozenBoards.filter(fb => {
    const effect = state.activeEffects.find(
      e => e.type === 'freeze' && e.targetBoard?.row === fb.row && e.targetBoard?.col === fb.col
    );
    return effect !== undefined;
  });
}

// Deep clone do estado
function deepCloneState(state: GameState): GameState {
  return {
    ...state,
    macroBoard: state.macroBoard.map(row =>
      row.map(board =>
        board.map(r => [...r])
      )
    ),
    macroOwners: state.macroOwners.map(row => [...row]),
    moveHistory: [...state.moveHistory],
    activeEffects: state.activeEffects.map(e => ({ ...e })),
    frozenBoards: [...state.frozenBoards],
    hiddenCells: [...state.hiddenCells],
    playerXPowers: new Map(state.playerXPowers),
    playerOPowers: new Map(state.playerOPowers),
  };
}

// ============================================
// PODERES ELEMENTAIS
// ============================================

// Ativar poder elemental
export function activatePower(state: GameState, element: Element, target?: Position | InnerPosition): GameState {
  const newState = deepCloneState(state);
  const currentPlayer = state.currentPlayer;
  const powers = currentPlayer === 'X' ? newState.playerXPowers : newState.playerOPowers;
  
  // Verificar se tem usos restantes
  const uses = powers.get(element) || 0;
  if (uses <= 0) return state;
  
  // Reduzir usos
  powers.set(element, uses - 1);
  
  switch (element) {
    case 'fire':
      // Queimar célula do adversário
      if (target && 'innerRow' in target) {
        const pos = target as Position;
        const cell = newState.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol];
        if (cell && cell !== currentPlayer) {
          newState.macroBoard[pos.macroRow][pos.macroCol][pos.innerRow][pos.innerCol] = null;
          newState.activeEffects.push({
            type: 'burn',
            element: 'fire',
            targetPosition: pos,
            turnsRemaining: 1,
            player: currentPlayer,
          });
        }
      }
      break;
      
    case 'ice':
      // Congelar tabuleiro
      if (target && 'row' in target && !('innerRow' in target)) {
        const boardPos = target as InnerPosition;
        if (newState.macroOwners[boardPos.row][boardPos.col] === null) {
          newState.frozenBoards.push(boardPos);
          newState.activeEffects.push({
            type: 'freeze',
            element: 'ice',
            targetBoard: boardPos,
            turnsRemaining: 4, // 2 turnos para cada jogador
            player: currentPlayer,
          });
        }
      }
      break;
      
    case 'lightning':
      // Dupla jogada
      newState.activeEffects.push({
        type: 'double_turn',
        element: 'lightning',
        turnsRemaining: 1,
        player: currentPlayer,
      });
      break;
      
    case 'wind':
      // Redirecionar
      if (target && 'row' in target && !('innerRow' in target)) {
        const boardPos = target as InnerPosition;
        newState.nextBoard = boardPos;
        newState.activeEffects.push({
          type: 'redirect',
          element: 'wind',
          targetBoard: boardPos,
          turnsRemaining: 1,
          player: currentPlayer,
        });
      }
      break;
      
    case 'darkness':
      // Ocultar movimentos
      newState.activeEffects.push({
        type: 'hide',
        element: 'darkness',
        turnsRemaining: 6, // 3 turnos para cada jogador
        player: currentPlayer,
      });
      break;
      
    case 'light':
      // Revelar melhor jogada
      newState.activeEffects.push({
        type: 'reveal',
        element: 'light',
        turnsRemaining: 2,
        player: currentPlayer,
      });
      break;
  }
  
  return newState;
}

// Verificar se tem efeito de dupla jogada ativo
export function hasDoubleTurn(state: GameState, player: 'X' | 'O'): boolean {
  return state.activeEffects.some(
    e => e.type === 'double_turn' && e.player === player && e.turnsRemaining > 0
  );
}

// ============================================
// IA
// ============================================

// Obter todas as jogadas válidas
export function getValidMoves(state: GameState): Position[] {
  const moves: Position[] = [];
  
  for (let macroRow = 0; macroRow < 3; macroRow++) {
    for (let macroCol = 0; macroCol < 3; macroCol++) {
      for (let innerRow = 0; innerRow < 3; innerRow++) {
        for (let innerCol = 0; innerCol < 3; innerCol++) {
          const pos: Position = { macroRow, macroCol, innerRow, innerCol };
          if (isValidMove(state, pos)) {
            moves.push(pos);
          }
        }
      }
    }
  }
  
  return moves;
}

// Avaliar posição (para IA)
export function evaluatePosition(state: GameState, player: 'X' | 'O'): number {
  const opponent = player === 'X' ? 'O' : 'X';
  const macroWinner = checkMacroWinner(state.macroOwners);
  
  if (macroWinner === player) return 1000;
  if (macroWinner === opponent) return -1000;
  
  const { X, O } = countCapturedBoards(state.macroOwners);
  const capturedDiff = player === 'X' ? X - O : O - X;
  
  // Contar quase-vitórias nos tabuleiros internos
  let nearWins = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (state.macroOwners[row][col] === null) {
        const board = state.macroBoard[row][col];
        nearWins += countNearWins(board, player);
        nearWins -= countNearWins(board, opponent);
      }
    }
  }
  
  return capturedDiff * 10 + nearWins * 2;
}

// Contar quase-vitórias em um tabuleiro
function countNearWins(board: InnerBoard, player: CellState): number {
  let count = 0;
  
  for (const pattern of WIN_PATTERNS) {
    const cells = pattern.map(([r, c]) => board[r][c]);
    const playerCount = cells.filter(c => c === player).length;
    const nullCount = cells.filter(c => c === null).length;
    
    if (playerCount === 2 && nullCount === 1) {
      count++;
    }
  }
  
  return count;
}

// Jogada da IA (Minimax simplificado)
export function getAIMove(state: GameState, difficulty: 'easy' | 'medium' | 'hard'): Position | null {
  const validMoves = getValidMoves(state);
  
  if (validMoves.length === 0) return null;
  
  // Easy: jogada aleatória
  if (difficulty === 'easy') {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
  
  // Medium: evitar jogadas óbvias de derrota
  if (difficulty === 'medium') {
    // Priorizar capturas de tabuleiro
    for (const move of validMoves) {
      const testState = makeMove(state, move);
      if (testState.macroOwners[move.macroRow][move.macroCol] === state.currentPlayer) {
        return move;
      }
    }
    
    // Evitar enviar para tabuleiros bons para o adversário
    const safeMoves = validMoves.filter(move => {
      const testState = makeMove(state, move);
      const nextBoardOwner = testState.macroOwners[move.innerRow][move.innerCol];
      return nextBoardOwner === null;
    });
    
    if (safeMoves.length > 0) {
      return safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }
    
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
  
  // Hard: Minimax
  let bestMove = validMoves[0];
  let bestScore = -Infinity;
  
  for (const move of validMoves) {
    const testState = makeMove(state, move);
    const score = minimax(testState, 3, false, state.currentPlayer, -Infinity, Infinity);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Algoritmo Minimax com poda alfa-beta
function minimax(
  state: GameState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: 'X' | 'O',
  alpha: number,
  beta: number
): number {
  if (depth === 0 || state.gameStatus === 'finished') {
    return evaluatePosition(state, aiPlayer);
  }
  
  const validMoves = getValidMoves(state);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newState = makeMove(state, move);
      const evalScore = minimax(newState, depth - 1, false, aiPlayer, alpha, beta);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newState = makeMove(state, move);
      const evalScore = minimax(newState, depth - 1, true, aiPlayer, alpha, beta);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Verificar se o jogo terminou em empate total
export function isFullDraw(state: GameState): boolean {
  // Todos os tabuleiros internos resolvidos
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (state.macroOwners[row][col] === null) {
        return false;
      }
    }
  }
  return state.winner === null;
}
