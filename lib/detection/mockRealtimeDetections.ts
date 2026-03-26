import { FoodDetection } from '@/types/detection';

type DetectionScenario = {
  label: string;
  confidence: number;
  kcalPer100g?: number;
  carbsPer100g: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  potassiumMgPer100g?: number;
  sodiumMgPer100g?: number;
  vitaminBMgPer100g?: number;
  box: FoodDetection['box'];
};

const DETECTION_SCENARIOS: DetectionScenario[][] = [
  [
    {
      label: 'Rice bowl',
      confidence: 0.93,
      kcalPer100g: 130,
      carbsPer100g: 28,
      proteinPer100g: 3.1,
      fatPer100g: 0.4,
      potassiumMgPer100g: 35,
      sodiumMgPer100g: 1,
      vitaminBMgPer100g: 0.02,
      box: { x: 0.14, y: 0.5, width: 0.56, height: 0.22 },
    },
    {
      label: 'Leafy greens',
      confidence: 0.82,
      kcalPer100g: 23,
      carbsPer100g: 6.8,
      proteinPer100g: 2.5,
      fatPer100g: 0.5,
      potassiumMgPer100g: 210,
      sodiumMgPer100g: 79,
      vitaminBMgPer100g: 0.09,
      box: { x: 0.58, y: 0.3, width: 0.24, height: 0.14 },
    },
  ],
  [
    {
      label: 'Pasta bowl',
      confidence: 0.9,
      kcalPer100g: 157,
      carbsPer100g: 26.2,
      proteinPer100g: 5.1,
      fatPer100g: 1.3,
      potassiumMgPer100g: 44,
      sodiumMgPer100g: 6,
      vitaminBMgPer100g: 0.06,
      box: { x: 0.18, y: 0.46, width: 0.52, height: 0.24 },
    },
    {
      label: 'Tomato topping',
      confidence: 0.79,
      kcalPer100g: 18,
      carbsPer100g: 14.1,
      proteinPer100g: 1.2,
      fatPer100g: 0.2,
      potassiumMgPer100g: 237,
      sodiumMgPer100g: 5,
      vitaminBMgPer100g: 0.07,
      box: { x: 0.33, y: 0.33, width: 0.28, height: 0.1 },
    },
  ],
  [
    {
      label: 'Banana',
      confidence: 0.88,
      kcalPer100g: 89,
      carbsPer100g: 22.8,
      proteinPer100g: 1.1,
      fatPer100g: 0.3,
      potassiumMgPer100g: 358,
      sodiumMgPer100g: 1,
      vitaminBMgPer100g: 0.4,
      box: { x: 0.2, y: 0.42, width: 0.22, height: 0.3 },
    },
    {
      label: 'Greek yogurt',
      confidence: 0.76,
      kcalPer100g: 97,
      carbsPer100g: 8.9,
      proteinPer100g: 10,
      fatPer100g: 5.3,
      potassiumMgPer100g: 141,
      sodiumMgPer100g: 36,
      vitaminBMgPer100g: 0.08,
      box: { x: 0.55, y: 0.5, width: 0.24, height: 0.2 },
    },
  ],
];

export function getMockRealtimeDetections(step: number, timestamp: number): FoodDetection[] {
  const scenario = DETECTION_SCENARIOS[step % DETECTION_SCENARIOS.length] ?? [];

  return scenario.map((item, index) => ({
    id: `${item.label.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    label: item.label,
    confidence: item.confidence,
    box: item.box,
    nutrients: {
      kcalPer100g: item.kcalPer100g,
      carbsPer100g: item.carbsPer100g,
      proteinPer100g: item.proteinPer100g,
      fatPer100g: item.fatPer100g,
      potassiumMgPer100g: item.potassiumMgPer100g,
      sodiumMgPer100g: item.sodiumMgPer100g,
      vitaminBMgPer100g: item.vitaminBMgPer100g,
    },
    lastUpdatedAt: timestamp,
  }));
}
