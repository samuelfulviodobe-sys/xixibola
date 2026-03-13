// XIXIBOLA PRIME - Game Constants
import type { ElementalPower, Guardian, Element } from './types';

// Cores base para cada elemento
export const ELEMENT_COLORS: Record<Element, { primary: string; secondary: string; glow: string }> = {
  fire: {
    primary: '#ff4d00',
    secondary: '#ff8c00',
    glow: 'rgba(255, 77, 0, 0.6)',
  },
  ice: {
    primary: '#00d4ff',
    secondary: '#7fefff',
    glow: 'rgba(0, 212, 255, 0.6)',
  },
  lightning: {
    primary: '#ffd700',
    secondary: '#fff44f',
    glow: 'rgba(255, 215, 0, 0.6)',
  },
  wind: {
    primary: '#90ee90',
    secondary: '#c6ffc6',
    glow: 'rgba(144, 238, 144, 0.6)',
  },
  darkness: {
    primary: '#9933ff',
    secondary: '#cc66ff',
    glow: 'rgba(153, 51, 255, 0.6)',
  },
  light: {
    primary: '#ffffff',
    secondary: '#ffffd0',
    glow: 'rgba(255, 255, 255, 0.6)',
  },
};

// Poderes elementais disponíveis
export const ELEMENTAL_POWERS: ElementalPower[] = [
  {
    id: 'fire',
    name: 'Fogo',
    emoji: '🔥',
    color: '#ff4d00',
    bgColor: 'rgba(255, 77, 0, 0.2)',
    glowColor: 'rgba(255, 77, 0, 0.8)',
    description: 'Queima 1 célula do adversário, removendo-a do jogo',
    cooldown: 5,
    maxUses: 2,
  },
  {
    id: 'ice',
    name: 'Gelo',
    emoji: '❄️',
    color: '#00d4ff',
    bgColor: 'rgba(0, 212, 255, 0.2)',
    glowColor: 'rgba(0, 212, 255, 0.8)',
    description: 'Congela um tabuleiro por 2 turnos (ninguém pode jogar lá)',
    cooldown: 6,
    maxUses: 1,
  },
  {
    id: 'lightning',
    name: 'Raio',
    emoji: '⚡',
    color: '#ffd700',
    bgColor: 'rgba(255, 215, 0, 0.2)',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    description: 'Jogue 2 vezes consecutivas na mesma rodada',
    cooldown: 8,
    maxUses: 1,
  },
  {
    id: 'wind',
    name: 'Vento',
    emoji: '🌪️',
    color: '#90ee90',
    bgColor: 'rgba(144, 238, 144, 0.2)',
    glowColor: 'rgba(144, 238, 144, 0.8)',
    description: 'Redireciona o adversário para qualquer tabuleiro à sua escolha',
    cooldown: 4,
    maxUses: 2,
  },
  {
    id: 'darkness',
    name: 'Trevas',
    emoji: '🌑',
    color: '#9933ff',
    bgColor: 'rgba(153, 51, 255, 0.2)',
    glowColor: 'rgba(153, 51, 255, 0.8)',
    description: 'Oculta seus próximos 3 movimentos do adversário',
    cooldown: 7,
    maxUses: 1,
  },
  {
    id: 'light',
    name: 'Luz',
    emoji: '🌕',
    color: '#ffffff',
    bgColor: 'rgba(255, 255, 255, 0.2)',
    glowColor: 'rgba(255, 255, 255, 0.8)',
    description: 'Revela a melhor jogada possível no próximo turno',
    cooldown: 5,
    maxUses: 2,
  },
];

// Guardiões/Mascotes
export const GUARDIANS: Guardian[] = [
  {
    id: 'ignar',
    name: 'Ignar',
    element: 'fire',
    emoji: '🐉',
    description: 'Dragão de fogo ancestral',
    bonus: 'Dano contínuo em casas adjacentes ao conquistar',
    rarity: 'legendary',
    level: 1,
    evolutionStage: 1,
  },
  {
    id: 'froya',
    name: 'Froya',
    element: 'ice',
    emoji: '🐺',
    description: 'Lobo do Ártico lendário',
    bonus: 'Reduz tempo de decisão do inimigo em 30%',
    rarity: 'epic',
    level: 1,
    evolutionStage: 1,
  },
  {
    id: 'volt',
    name: 'Volt',
    element: 'lightning',
    emoji: '🦅',
    description: 'Falcão tempestade celestial',
    bonus: 'Dobra XP ganho em cada partida',
    rarity: 'rare',
    level: 1,
    evolutionStage: 1,
  },
  {
    id: 'galeon',
    name: 'Galeon',
    element: 'wind',
    emoji: '🐍',
    description: 'Serpente celestial dos ventos',
    bonus: 'Permite um movimento alternativo gratuito por jogo',
    rarity: 'rare',
    level: 1,
    evolutionStage: 1,
  },
  {
    id: 'noctrix',
    name: 'Noctrix',
    element: 'darkness',
    emoji: '🦇',
    description: 'Hydra sombria das trevas',
    bonus: 'Tabuleiros ocultos permanecem ocultos por mais tempo',
    rarity: 'epic',
    level: 1,
    evolutionStage: 1,
  },
  {
    id: 'solare',
    name: 'Solare',
    element: 'light',
    emoji: '🦢',
    description: 'Fênix dourada da luz eterna',
    bonus: 'Segunda chance em jogadas críticas',
    rarity: 'legendary',
    level: 1,
    evolutionStage: 1,
  },
];

// Padrões de vitória
export const WIN_PATTERNS = [
  // Linhas
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  // Colunas
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  // Diagonais
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

// Padrões especiais (T, L, Espiral, X)
export const SPECIAL_PATTERNS = {
  T: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
  L: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  spiral: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [1, 0], [1, 1]],
  'X-elemental': [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
};

// XP necessário para cada nível
export const XP_PER_LEVEL = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// XP ganho por ação
export const XP_REWARDS = {
  win: 50,
  loss: 10,
  draw: 20,
  captureBoard: 5,
  usePower: 3,
  specialWin: 30,
  comboElemental: 100,
};
