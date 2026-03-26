import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NUTRITION_FOCUS_OPTIONS } from '@/lib/comparison/scoring';
import { getFoodDecisionHistoryEntry } from '@/lib/history/storage';
import { FoodDecisionHistoryEntry } from '@/types/history';

export default function HistoryEntryScreen() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const [entry, setEntry] = useState<FoodDecisionHistoryEntry | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!entryId) {
        return;
      }

      const nextEntry = await getFoodDecisionHistoryEntry(entryId);
      if (isMounted) {
        setEntry(nextEntry);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [entryId]);

  const chosen = entry?.options.find((option) => option.id === entry?.chosenOptionId);
  const recommended = entry?.options.find((option) => option.id === entry?.recommendedOptionId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Nutrient Facts', headerBackTitle: 'History' }} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!entry ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Decision not found</Text>
            <Text style={styles.emptyBody}>
              We could not load this saved history entry.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>Food Nutrient Facts</Text>
              <Text style={styles.title}>{chosen?.label ?? 'Saved choice'}</Text>
              <Text style={styles.subtitle}>
                Saved {formatDateTime(entry.createdAt)} · Focus {NUTRITION_FOCUS_OPTIONS[entry.selectedFocus].label}
              </Text>
              <Text style={styles.reason}>{entry.reason}</Text>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>Food database source: FatSecret</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chosen food</Text>
              <View style={styles.factCard}>
                <Text style={styles.factTitle}>{chosen?.label ?? 'Chosen option'}</Text>
                <Text style={styles.factMeta}>
                  {recommended?.id === chosen?.id ? 'Matched app recommendation' : 'User selected this option'}
                </Text>
                <View style={styles.metricsRow}>
                  <Metric label="Kcal" value={formatKcal(chosen?.nutrients?.kcalPer100g)} />
                  <Metric label="Carbs" value={formatGrams(chosen?.nutrients?.carbsPer100g)} />
                  <Metric label="Protein" value={formatGrams(chosen?.nutrients?.proteinPer100g)} />
                  <Metric label="Fat" value={formatGrams(chosen?.nutrients?.fatPer100g)} />
                  <Metric label="Potassium" value={formatMilligrams(chosen?.nutrients?.potassiumMgPer100g)} />
                  <Metric label="Vit B" value={formatMilligrams(chosen?.nutrients?.vitaminBMgPer100g)} />
                  <Metric label="Sodium" value={formatMilligrams(chosen?.nutrients?.sodiumMgPer100g)} />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compared foods</Text>
              {entry.options.map((option) => (
                <View key={option.id} style={styles.optionCard}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionTitle}>{option.label}</Text>
                    <Text style={styles.optionTag}>
                      {option.id === entry.chosenOptionId
                        ? 'Chosen'
                        : option.id === entry.recommendedOptionId
                          ? 'Recommended'
                          : 'Alternative'}
                    </Text>
                  </View>
                  <Text style={styles.optionMeta}>
                    Confidence {Math.round(option.confidence * 100)}%
                  </Text>
                  <View style={styles.optionFactsGrid}>
                    <Text style={styles.optionMetrics}>
                      Kcal {formatKcal(option.nutrients?.kcalPer100g)} · Carbs {formatGrams(option.nutrients?.carbsPer100g)}
                    </Text>
                    <Text style={styles.optionMetrics}>
                      Protein {formatGrams(option.nutrients?.proteinPer100g)} · Fat {formatGrams(option.nutrients?.fatPer100g)}
                    </Text>
                    <Text style={styles.optionMetrics}>
                      Potassium {formatMilligrams(option.nutrients?.potassiumMgPer100g)} · Sodium {formatMilligrams(option.nutrients?.sodiumMgPer100g)}
                    </Text>
                    <Text style={styles.optionMetrics}>
                      Vit B {formatMilligrams(option.nutrients?.vitaminBMgPer100g)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricPill}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatGrams(value?: number): string {
  if (value === undefined) {
    return '-';
  }

  return `${Number.isInteger(value) ? value : value.toFixed(1)}g`;
}

function formatKcal(value?: number): string {
  if (value === undefined) {
    return '-';
  }

  return `${Number.isInteger(value) ? value : value.toFixed(1)} kcal`;
}

function formatMilligrams(value?: number): string {
  if (value === undefined) {
    return '-';
  }

  return `${Number.isInteger(value) ? value : value.toFixed(1)}mg`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0F14',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  emptyCard: {
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: '#B9C2D7',
    fontSize: 14,
    lineHeight: 21,
  },
  heroCard: {
    backgroundColor: '#151B27',
    borderWidth: 1,
    borderColor: '#2A3A56',
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  eyebrow: {
    color: '#49C6E5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B6C1D7',
    fontSize: 14,
    lineHeight: 20,
  },
  reason: {
    color: '#D7DEEE',
    fontSize: 14,
    lineHeight: 21,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 250, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sourceBadgeText: {
    color: '#D5DEEF',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  factCard: {
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  factTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  factMeta: {
    color: '#B9C2D7',
    fontSize: 13,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricPill: {
    minWidth: '30%',
    borderRadius: 16,
    backgroundColor: '#202636',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  metricLabel: {
    color: '#93A1BE',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  optionCard: {
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  optionTag: {
    color: '#BDF2FF',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(73, 198, 229, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(73, 198, 229, 0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  optionMeta: {
    color: '#ADB6C8',
    fontSize: 13,
  },
  optionFactsGrid: {
    gap: 4,
  },
  optionMetrics: {
    color: '#D3DBEC',
    fontSize: 13,
    lineHeight: 19,
  },
});
