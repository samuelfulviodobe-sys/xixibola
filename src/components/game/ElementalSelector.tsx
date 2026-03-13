'use client';

import { cn } from '@/lib/utils';
import { ELEMENTAL_POWERS, ELEMENT_COLORS } from '@/lib/game/constants';
import type { Element } from '@/lib/game/types';

interface ElementalSelectorProps {
  selectedElement: Element | null;
  onSelect: (element: Element) => void;
  disabled?: boolean;
}

export function ElementalSelector({ selectedElement, onSelect, disabled }: ElementalSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
      {ELEMENTAL_POWERS.map((power) => {
        const colors = ELEMENT_COLORS[power.id];
        const isSelected = selectedElement === power.id;

        return (
          <button
            key={power.id}
            onClick={() => !disabled && onSelect(power.id)}
            disabled={disabled}
            className={cn(
              'element-btn',
              power.id,
              { 'selected': isSelected }
            )}
          >
            <span className="text-3xl sm:text-4xl mb-2 drop-shadow-lg">{power.emoji}</span>
            <span
              className="text-sm sm:text-base font-bold"
              style={{ color: colors.primary }}
            >
              {power.name}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">
              {power.description}
            </span>
            {isSelected && (
              <div
                className="absolute inset-0 rounded-xl animate-pulse"
                style={{
                  background: `${colors.glow}`,
                  opacity: 0.3,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
