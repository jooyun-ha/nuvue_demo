import { NutritionFocus } from '@/lib/comparison/scoring';
import { FoodDetection } from '@/types/detection';

export type DecisionOptionSnapshot = {
  id: string;
  label: string;
  confidence: number;
  nutrients?: FoodDetection['nutrients'];
  wasRecommended: boolean;
};

export type FoodDecisionHistoryEntry = {
  id: string;
  createdAt: string;
  selectedFocus: NutritionFocus;
  chosenOptionId: string;
  recommendedOptionId?: string;
  reason: string;
  options: DecisionOptionSnapshot[];
};
