import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NUTRITION_FOCUS_OPTIONS } from '@/lib/comparison/scoring';
import { getFoodDecisionHistory } from '@/lib/history/storage';
import { FoodDecisionHistoryEntry } from '@/types/history';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<FoodDecisionHistoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const load = async () => {
        const nextEntries = await getFoodDecisionHistory();
        if (isMounted) {
          setEntries(nextEntries);
        }
      };

      void load();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>My History</Text>
        <Text style={styles.title}>Food Decision Log</Text>
        <Text style={styles.subtitle}>
          Every saved choice appears here so we can build food history and pattern analysis later.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No saved decisions yet</Text>
            <Text style={styles.emptyBody}>
              Scan two foods, tap a box, then use `Choose this` to save your first food decision.
            </Text>
          </View>
        ) : (
          buildHistorySections(entries).map((section) => (
            <View key={section.dateKey} style={styles.dateSection}>
              <Text style={styles.dateHeading}>{section.dateLabel}</Text>

              {section.entries.map((entry) => {
                const chosen = entry.options.find((option) => option.id === entry.chosenOptionId);
                const recommended = entry.options.find(
                  (option) => option.id === entry.recommendedOptionId
                );
                const alternatives = entry.options.filter(
                  (option) => option.id !== entry.chosenOptionId
                );

                return (
                  <View key={entry.id} style={styles.historyCard}>
                    <View style={styles.cardThumbnail}>
                      <Text style={styles.thumbnailEyebrow}>{formatTime(entry.createdAt)}</Text>
                      <View style={styles.thumbnailBadge}>
                        <Text style={styles.thumbnailBadgeText}>Food Log</Text>
                      </View>
                      <Text style={styles.thumbnailLabel}>{chosen?.label ?? 'Saved choice'}</Text>
                    </View>

                    <Pressable
                      onPress={() => router.push(`/history/${entry.id}`)}
                      style={styles.cardDetails}>
                      <Text style={styles.cardTitle}>{chosen?.label ?? 'Saved choice'}</Text>
                      <Text style={styles.cardMeta}>
                        Focus: {NUTRITION_FOCUS_OPTIONS[entry.selectedFocus].label}
                      </Text>
                      <Text style={styles.cardMeta}>
                        App recommendation: {recommended?.label ?? 'Unavailable'}
                      </Text>
                      <Text style={styles.cardReason}>{entry.reason}</Text>
                      {alternatives.length > 0 ? (
                        <Text style={styles.cardAlternatives}>
                          Compared with: {alternatives.map((option) => option.label).join(', ')}
                        </Text>
                      ) : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function buildHistorySections(entries: FoodDecisionHistoryEntry[]) {
  const grouped = new Map<string, FoodDecisionHistoryEntry[]>();

  entries.forEach((entry) => {
    const dateKey = new Date(entry.createdAt).toISOString().slice(0, 10);
    const current = grouped.get(dateKey) ?? [];
    current.push(entry);
    grouped.set(dateKey, current);
  });

  return Array.from(grouped.entries()).map(([dateKey, sectionEntries]) => ({
    dateKey,
    dateLabel: formatDateHeading(sectionEntries[0]?.createdAt ?? dateKey),
    entries: sectionEntries,
  }));
}

function formatDateHeading(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0F14',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
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
    color: '#F9FBFF',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#ADB6C8',
    fontSize: 15,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
    gap: 14,
  },
  dateSection: {
    gap: 12,
  },
  dateHeading: {
    color: '#F9FBFF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    paddingTop: 4,
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
  historyCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: '#2A3142',
    borderRadius: 22,
    padding: 18,
  },
  cardThumbnail: {
    width: '33%',
    minHeight: 136,
    borderRadius: 18,
    backgroundColor: '#202636',
    borderWidth: 1,
    borderColor: '#33415B',
    padding: 12,
    justifyContent: 'space-between',
  },
  thumbnailEyebrow: {
    color: '#95A2BD',
    fontSize: 12,
    fontWeight: '700',
  },
  thumbnailBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(73, 198, 229, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(73, 198, 229, 0.34)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  thumbnailBadgeText: {
    color: '#BDF2FF',
    fontSize: 11,
    fontWeight: '800',
  },
  thumbnailLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  cardDetails: {
    width: '67%',
    gap: 8,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  cardMeta: {
    color: '#D3DBEC',
    fontSize: 13,
    lineHeight: 18,
  },
  cardReason: {
    color: '#9FADC6',
    fontSize: 13,
    lineHeight: 19,
  },
  cardAlternatives: {
    color: '#7E8BA5',
    fontSize: 13,
    lineHeight: 19,
  },
});
