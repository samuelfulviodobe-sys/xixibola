// XIXIBOLA PRIME - Game Types

// Elementos disponíveis no jogo
export type Element = 'fire' | 'ice' | 'lightning' | 'wind' | 'darkness' | 'light';

// Estado de cada célula do tabuleiro
export type CellState = 'X' | 'O' | null;

// Estado de um tabuleiro interno (3x3)
export type InnerBoard = CellState[][];

// Estado do tabuleiro macro (3x3 de InnerBoards)
export type MacroBoard = InnerBoard[][];

// Estado de domínio de um tabuleiro interno
export type BoardOwner = 'X' | 'O' | 'draw' | null;

// Tabuleiro macro de proprietários
export type MacroOwners = BoardOwner[][];

// Posição no tabuleiro
export interface Position {
  macroRow: number;
  macroCol: number;
  innerRow: number;
  innerCol: number;
}

// Posição simplificada para tabuleiro interno
export interface InnerPosition {
  row: number;
  col: number;
}

// Poderes elementais e seus efeitos
export interface ElementalPower {
  id: Element;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  glowColor: string;
  description: string;
  cooldown: number;
  maxUses: number;
}

// Guardiões/Mascotes
export interface Guardian {
  id: string;
  name: string;
  element: Element;
  emoji: string;
  description: string;
  bonus: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  evolutionStage: number;
}

// Efeito ativo no jogo
export interface ActiveEffect {
  type: 'burn' | 'freeze' | 'double_turn' | 'redirect' | 'hide' | 'reveal';
  element: Element;
  targetPosition?: Position;
  targetBoard?: InnerPosition;
  turnsRemaining: number;
  player: 'X' | 'O';
}

// Estado completo do jogo
export interface GameState {
  macroBoard: MacroBoard;
  macroOwners: MacroOwners;
  currentPlayer: 'X' | 'O';
  nextBoard: InnerPosition | null;
  playerXElement: Element | null;
  playerOElement: Element | null;
  playerXPowers: Map<Element, number>;
  playerOPowers: Map<Element, number>;
  activeEffects: ActiveEffect[];
  moveHistory: Position[];
  gameStatus: 'selecting_elements' | 'playing' | 'paused' | 'finished';
  winner: 'X' | 'O' | 'draw' | null;
  moveCount: number;
  capturedBoardsX: number;
  capturedBoardsO: number;
  activePower: Element | null;
  frozenBoards: InnerPosition[];
  hiddenCells: Position[];
}

// Configuração do jogo
export interface GameConfig {
  vsAI: boolean;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  specialRules: {
    instantWinChaos: boolean;
    comboElemental: boolean;
    specialPatterns: boolean;
  };
}

// Resultado de uma jogada
export interface MoveResult {
  valid: boolean;
  newState?: GameState;
  error?: string;
  capturedBoard?: InnerPosition;
  triggeredEffect?: ActiveEffect;
  winningMove?: boolean;
}

// Padrões especiais de vitória
export type SpecialPattern = 'T' | 'L' | 'spiral' | 'X-elemental';

// Conquistas
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

// Estatísticas do jogador
export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
  elementStats: Record<Element, { wins: number; games: number }>;
  achievements: Achievement[];
}
