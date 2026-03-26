export type OverlayTone = 'green' | 'yellow' | 'red';

export type DetectionBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NutrientSnapshot = {
  kcalPer100g?: number;
  carbsPer100g: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  potassiumMgPer100g?: number;
  sodiumMgPer100g?: number;
  vitaminBMgPer100g?: number;
};

export type FoodDetection = {
  id: string;
  label: string;
  confidence: number;
  box: DetectionBoundingBox;
  nutrients?: NutrientSnapshot;
  tone?: OverlayTone;
  lastUpdatedAt: number;
};
