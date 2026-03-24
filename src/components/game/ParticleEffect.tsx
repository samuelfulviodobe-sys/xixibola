'use client';

import { useMemo, useCallback } from 'react';
import type { Element } from '@/lib/game/types';
import { ELEMENT_COLORS } from '@/lib/game/constants';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface ParticleEffectProps {
  element: Element;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function ParticleEffect({
  element,
  intensity = 'medium',
  className = '',
}: ParticleEffectProps) {
  const colors = ELEMENT_COLORS[element];

  const particleCount = {
    low: 5,
    medium: 12,
    high: 25,
  };

  // Use useMemo to generate particles without setState in effect
  const particles = useMemo(() => {
    const count = particleCount[intensity];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colors.primary,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5,
      });
    }

    return newParticles;
  }, [element, intensity, colors.primary]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: 0.6,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}

// Victory explosion effect - simplified without setState in effect
interface VictoryExplosionProps {
  trigger: boolean;
  element: Element;
  onComplete?: () => void;
}

export function VictoryExplosion({
  trigger,
  element,
  onComplete,
}: VictoryExplosionProps) {
  const colors = ELEMENT_COLORS[element];

  const explosions = useMemo(() => {
    if (!trigger) return [];

    const newExplosions: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newExplosions.push({
        id: i,
        x: 50,
        y: 50,
        size: Math.random() * 12 + 4,
        color: i % 2 === 0 ? colors.primary : colors.secondary,
        duration: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 0.3,
      });
    }
    return newExplosions;
  }, [trigger, colors.primary, colors.secondary]);

  // Call onComplete after animation
  const handleAnimationEnd = useCallback(() => {
    if (trigger && onComplete) {
      setTimeout(onComplete, 2000);
    }
  }, [trigger, onComplete]);

  if (!trigger || explosions.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" onAnimationEnd={handleAnimationEnd}>
      {explosions.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-explode"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}

// Move ripple effect
interface MoveRippleProps {
  x: number;
  y: number;
  element: Element;
  player: 'X' | 'O';
}

export function MoveRipple({ x, y, element, player }: MoveRippleProps) {
  const color = player === 'X' ? '#ff4d00' : '#00d4ff';

  return (
    <div
      className="absolute pointer-events-none animate-ripple"
      style={{
        left: x,
        top: y,
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}`,
      }}
    />
  );
}

// Elemental aura effect
interface ElementalAuraProps {
  element: Element;
  active: boolean;
  children: React.ReactNode;
}

export function ElementalAura({
  element,
  active,
  children,
}: ElementalAuraProps) {
  const colors = ELEMENT_COLORS[element];

  return (
    <div className="relative">
      {active && (
        <div
          className="absolute inset-0 rounded-xl animate-pulse-slow"
          style={{
            boxShadow: `inset 0 0 30px ${colors.glow}, 0 0 30px ${colors.glow}`,
          }}
        />
      )}
      {children}
    </div>
  );
}
