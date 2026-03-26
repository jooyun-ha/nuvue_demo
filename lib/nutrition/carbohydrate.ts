import { OverlayTone } from '@/types/detection';

export const CARB_THRESHOLDS = {
  greenMax: 10,
  yellowMax: 25,
} as const;

export function getCarbohydrateTone(carbsPer100g: number): OverlayTone {
  if (carbsPer100g < CARB_THRESHOLDS.greenMax) {
    return 'green';
  }

  if (carbsPer100g <= CARB_THRESHOLDS.yellowMax) {
    return 'yellow';
  }

  return 'red';
}

export function formatCarbohydrates(carbsPer100g: number): string {
  const rounded = Number.isInteger(carbsPer100g) ? carbsPer100g : carbsPer100g.toFixed(1);
  return `${rounded}g carbs / 100g`;
}
