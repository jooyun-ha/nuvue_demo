import { FoodDetection } from '@/types/detection';

export type NutritionFocus = 'balanced' | 'carbohydrate' | 'protein' | 'lowPotassium';

export type ComparedFoodOption = FoodDetection & {
  score: number;
  isBest: boolean;
  reason: string;
};

type FocusDefinition = {
  label: string;
  shortDescription: string;
};

export const NUTRITION_FOCUS_OPTIONS: Record<NutritionFocus, FocusDefinition> = {
  balanced: {
    label: 'Balanced',
    shortDescription: 'Considers carbs, protein, and potassium together.',
  },
  carbohydrate: {
    label: 'Carbohydrate',
    shortDescription: 'Favors lower carbohydrate options.',
  },
  protein: {
    label: 'Protein',
    shortDescription: 'Favors higher protein options.',
  },
  lowPotassium: {
    label: 'Low Potassium',
    shortDescription: 'Favors lower potassium options.',
  },
};

export function compareFoodOptions(
  detections: FoodDetection[],
  focus: NutritionFocus
): ComparedFoodOption[] {
  const compared = detections.map((detection) => {
    const score = getScoreForFocus(detection, focus);
    return {
      ...detection,
      score,
      isBest: false,
      reason: getReasonForFocus(detection, focus),
    };
  });

  const bestId = compared.reduce<string | null>((currentBestId, option) => {
    if (!currentBestId) {
      return option.id;
    }

    const currentBest = compared.find((item) => item.id === currentBestId);
    if (!currentBest || option.score > currentBest.score) {
      return option.id;
    }

    return currentBestId;
  }, null);

  return compared.map((option) => ({
    ...option,
    isBest: option.id === bestId,
  }));
}

function getScoreForFocus(detection: FoodDetection, focus: NutritionFocus): number {
  const carbs = detection.nutrients?.carbsPer100g ?? 0;
  const protein = detection.nutrients?.proteinPer100g ?? 0;
  const potassium = detection.nutrients?.potassiumMgPer100g ?? 0;

  switch (focus) {
    case 'carbohydrate':
      return 100 - carbs;
    case 'protein':
      return protein * 10 - carbs * 0.5;
    case 'lowPotassium':
      return 100 - potassium / 10 - carbs * 0.25;
    case 'balanced':
    default:
      return protein * 8 - carbs * 1.4 - potassium / 25;
  }
}

function getReasonForFocus(detection: FoodDetection, focus: NutritionFocus): string {
  const carbs = detection.nutrients?.carbsPer100g;
  const protein = detection.nutrients?.proteinPer100g;
  const potassium = detection.nutrients?.potassiumMgPer100g;

  switch (focus) {
    case 'carbohydrate':
      return `Lower carbohydrate option at ${formatNumber(carbs)}g per 100g.`;
    case 'protein':
      return `Higher protein support with ${formatNumber(protein)}g protein per 100g.`;
    case 'lowPotassium':
      return `Lower potassium choice at ${formatNumber(potassium)}mg per 100g.`;
    case 'balanced':
    default:
      return `Best overall mix of carbs, protein, and potassium for a general comparison.`;
  }
}

function formatNumber(value?: number): string {
  if (value === undefined) {
    return '-';
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
