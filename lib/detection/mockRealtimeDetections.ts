import { FoodDetection } from '@/types/detection';

type DetectionScenario = {
  label: string;
  confidence: number;
  carbsPer100g: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  potassiumMgPer100g?: number;
  box: FoodDetection['box'];
};

const DETECTION_SCENARIOS: DetectionScenario[][] = [
  [
    {
      label: 'Rice bowl',
      confidence: 0.93,
      carbsPer100g: 28,
      proteinPer100g: 3.1,
      fatPer100g: 0.4,
      potassiumMgPer100g: 35,
      box: { x: 0.14, y: 0.5, width: 0.56, height: 0.22 },
    },
    {
      label: 'Leafy greens',
      confidence: 0.82,
      carbsPer100g: 6.8,
      proteinPer100g: 2.5,
      fatPer100g: 0.5,
      potassiumMgPer100g: 210,
      box: { x: 0.58, y: 0.3, width: 0.24, height: 0.14 },
    },
  ],
  [
    {
      label: 'Pasta bowl',
      confidence: 0.9,
      carbsPer100g: 26.2,
      proteinPer100g: 5.1,
      fatPer100g: 1.3,
      potassiumMgPer100g: 44,
      box: { x: 0.18, y: 0.46, width: 0.52, height: 0.24 },
    },
    {
      label: 'Tomato topping',
      confidence: 0.79,
      carbsPer100g: 14.1,
      proteinPer100g: 1.2,
      fatPer100g: 0.2,
      potassiumMgPer100g: 237,
      box: { x: 0.33, y: 0.33, width: 0.28, height: 0.1 },
    },
  ],
  [
    {
      label: 'Banana',
      confidence: 0.88,
      carbsPer100g: 22.8,
      proteinPer100g: 1.1,
      fatPer100g: 0.3,
      potassiumMgPer100g: 358,
      box: { x: 0.2, y: 0.42, width: 0.22, height: 0.3 },
    },
    {
      label: 'Greek yogurt',
      confidence: 0.76,
      carbsPer100g: 8.9,
      proteinPer100g: 10,
      fatPer100g: 5.3,
      potassiumMgPer100g: 141,
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
      carbsPer100g: item.carbsPer100g,
      proteinPer100g: item.proteinPer100g,
      fatPer100g: item.fatPer100g,
      potassiumMgPer100g: item.potassiumMgPer100g,
    },
    lastUpdatedAt: timestamp,
  }));
}
