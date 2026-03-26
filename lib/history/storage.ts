import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComparedFoodOption, NutritionFocus } from '@/lib/comparison/scoring';
import { FoodDecisionHistoryEntry } from '@/types/history';

const HISTORY_STORAGE_KEY = 'nuvue.food-decision-history';
let memoryHistory: FoodDecisionHistoryEntry[] = [];

export async function getFoodDecisionHistory(): Promise<FoodDecisionHistoryEntry[]> {
  const raw = await getStoredHistory();

  if (!raw) {
    return [...memoryHistory];
  }

  try {
    const parsed = JSON.parse(raw) as FoodDecisionHistoryEntry[];
    const sorted = parsed.sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
    memoryHistory = sorted;
    return sorted;
  } catch {
    return [...memoryHistory];
  }
}

export async function getFoodDecisionHistoryEntry(
  entryId: string
): Promise<FoodDecisionHistoryEntry | null> {
  const entries = await getFoodDecisionHistory();
  return entries.find((entry) => entry.id === entryId) ?? null;
}

export async function saveFoodDecision(params: {
  selectedFocus: NutritionFocus;
  chosenOption: ComparedFoodOption;
  comparedOptions: ComparedFoodOption[];
}): Promise<FoodDecisionHistoryEntry> {
  const existing = await getFoodDecisionHistory();
  const recommendedOption = params.comparedOptions.find((option) => option.isBest);

  const entry: FoodDecisionHistoryEntry = {
    id: `${params.chosenOption.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    selectedFocus: params.selectedFocus,
    chosenOptionId: params.chosenOption.id,
    recommendedOptionId: recommendedOption?.id,
    reason: params.chosenOption.reason,
    options: params.comparedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      confidence: option.confidence,
      nutrients: option.nutrients,
      wasRecommended: option.isBest,
    })),
  };

  const next = [entry, ...existing];
  memoryHistory = next;
  await setStoredHistory(JSON.stringify(next));
  return entry;
}

async function getStoredHistory(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function setStoredHistory(value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, value);
  } catch {
    // Keep the in-memory fallback alive when the native storage module is unavailable.
  }
}
