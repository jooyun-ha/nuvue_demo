import Constants from 'expo-constants';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  compareFoodOptions,
  NUTRITION_FOCUS_OPTIONS,
  NutritionFocus,
} from '@/lib/comparison/scoring';
import { getMockRealtimeDetections } from '@/lib/detection/mockRealtimeDetections';
import { formatCarbohydrates } from '@/lib/nutrition/carbohydrate';
import { FoodDetection } from '@/types/detection';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [detectionStep, setDetectionStep] = useState(0);
  const [detections, setDetections] = useState<FoodDetection[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<NutritionFocus>('balanced');
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isScanning || Platform.OS === 'web') {
      setDetections([]);
      setDetectionStep(0);
      setSelectedDetectionId(null);
      return;
    }

    if (selectedDetectionId) {
      return;
    }

    // Simulate a realtime detector feed using the same object shape the future model will produce.
    setDetections(getMockRealtimeDetections(detectionStep, Date.now()));

    const interval = setInterval(() => {
      setDetectionStep((current) => {
        const nextStep = current + 1;
        setDetections(getMockRealtimeDetections(nextStep, Date.now()));
        return nextStep;
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [detectionStep, isScanning, selectedDetectionId]);

  const comparedDetections = compareFoodOptions(detections, selectedFocus);
  const selectedDetection =
    comparedDetections.find((detection) => detection.id === selectedDetectionId) ?? null;
  const startScanning = async () => {
    setPermissionDenied(false);

    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        setPermissionDenied(true);
        return;
      }
    }

    setIsScanning(true);
  };

  if (isScanning) {
    const isWeb = Platform.OS === 'web';

    return (
      <SafeAreaView style={styles.cameraSafeArea}>
        <StatusBar style="light" />
        <View style={styles.cameraView}>
          {!isWeb && !isExpoGo ? (
            <NativeVisionCameraPreview isActive={isScanning} />
          ) : !isWeb ? (
            <CameraView style={StyleSheet.absoluteFill} facing="back" />
          ) : (
            <View style={styles.cameraFallback}>
              <Text style={styles.cameraFallbackTitle}>
                {isWeb ? 'Live camera is native-only' : 'Using Expo Go fallback'}
              </Text>
              <Text style={styles.cameraFallbackText}>
                {isWeb
                  ? 'VisionCamera does not support web preview. Test this scan screen on iOS or Android with a custom dev build.'
                  : 'Expo Go cannot load react-native-vision-camera. Use a custom dev build for the real native camera path.'}
              </Text>
            </View>
          )}

          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>Scanning View</Text>
            <Pressable onPress={() => setIsScanning(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.overlayLayer}>
            <View style={styles.scanGuidance}>
              <Text style={styles.scanGuidanceTitle}>Comparison Guidance</Text>
              <Text style={styles.scanGuidanceBody}>
                Compare detected foods and highlight the best option for the selected nutrition goal.
              </Text>
            </View>

            {comparedDetections.map((detection) => (
              <Pressable
                key={detection.id}
                onPress={() =>
                  setSelectedDetectionId((current) =>
                    current === detection.id ? null : detection.id
                  )
                }
                style={[
                  styles.detectionBox,
                  detection.isBest ? styles.bestDetectionBox : styles.otherDetectionBox,
                  selectedDetectionId === detection.id && styles.selectedDetectionBox,
                  {
                    top: `${detection.box.y * 100}%`,
                    left: `${detection.box.x * 100}%`,
                    width: `${detection.box.width * 100}%`,
                    height: `${detection.box.height * 100}%`,
                  },
                ]}>
                <View style={detection.isBest ? styles.bestDetectionChip : styles.otherDetectionChip}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.detectionLabel}>
                    {detection.label}
                  </Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.detectionMetric}>
                    {getCompactFocusMetricLabel(detection, selectedFocus)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.cameraFooter}>
            {selectedDetection ? (
              <Pressable onPress={() => setSelectedDetectionId(null)} style={styles.statusCard}>
                <Text style={styles.statusTitle}>{selectedDetection.label}</Text>
                <Text style={styles.statusText}>
                  {selectedDetection.isBest ? 'Recommended choice' : 'Alternative option'}
                </Text>
                <Text style={styles.statusText}>
                  Focus: {NUTRITION_FOCUS_OPTIONS[selectedFocus].label}
                </Text>
                <Text style={styles.statusText}>
                  Confidence: {Math.round(selectedDetection.confidence * 100)}%
                </Text>
                <Text style={styles.statusText}>{selectedDetection.reason}</Text>
                {selectedDetection.nutrients ? (
                  <Text style={styles.statusText}>
                    {getFocusMetricLabel(selectedDetection, selectedFocus)}
                  </Text>
                ) : null}
              </Pressable>
            ) : null}

            <View style={styles.focusSelector}>
              {(
                Object.entries(NUTRITION_FOCUS_OPTIONS) as Array<
                  [NutritionFocus, (typeof NUTRITION_FOCUS_OPTIONS)[NutritionFocus]]
                >
              ).map(([focusKey, focusOption]) => {
                const isSelected = focusKey === selectedFocus;

                return (
                  <Pressable
                    key={focusKey}
                    onPress={() => setSelectedFocus(focusKey)}
                    style={[styles.focusButton, isSelected && styles.focusButtonSelected]}>
                    <Text style={[styles.focusButtonText, isSelected && styles.focusButtonTextSelected]}>
                      {focusOption.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.backgroundShapeTop} />
      <View style={styles.backgroundShapeBottom} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Nuvue</Text>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Camera Nutrition Companion</Text>
        </View>

        <Text style={styles.title}>See your plate. Decide smarter.</Text>
        <Text style={styles.subtitle}>
          Nuvue helps you choose what to eat by understanding what your camera sees and turning it
          into practical meal guidance.
        </Text>

        <View style={styles.conceptCard}>
          <Text style={styles.cardTitle}>The Concept</Text>
          <View style={styles.flowRow}>
            <View style={styles.flowItem}>
              <Text style={styles.flowEmoji}>[CAM]</Text>
              <Text style={styles.flowLabel}>Point camera</Text>
            </View>
            <Text style={styles.flowArrow}>{'->'}</Text>
            <View style={styles.flowItem}>
              <Text style={styles.flowEmoji}>[FOOD]</Text>
              <Text style={styles.flowLabel}>Detect food</Text>
            </View>
            <Text style={styles.flowArrow}>{'->'}</Text>
            <View style={styles.flowItem}>
              <Text style={styles.flowEmoji}>[PICK]</Text>
              <Text style={styles.flowLabel}>Pick better option</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            Built for everyday decisions: restaurant menus, grocery shelves, and what is already in
            your kitchen.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable onPress={startScanning} style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Start Scanning</Text>
          </Pressable>
          {permissionDenied ? (
            <Text style={styles.permissionMessage}>
              Camera access is required to start scanning. Enable it in device settings.
            </Text>
          ) : null}

          <Pressable disabled style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>See How It Works</Text>
          </Pressable>

          <Pressable disabled style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Join Waitlist</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NativeVisionCameraPreview({ isActive }: { isActive: boolean }) {
  const { Camera, useCameraDevice } =
    require('react-native-vision-camera') as typeof import('react-native-vision-camera');
  const device = useCameraDevice('back');

  if (!device) {
    return (
      <View style={styles.cameraFallback}>
        <Text style={styles.cameraFallbackTitle}>Back camera unavailable</Text>
        <Text style={styles.cameraFallbackText}>
          VisionCamera could not find a back camera on this device.
        </Text>
      </View>
    );
  }

  return <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive} />;
}

function getFocusMetricLabel(detection: FoodDetection, focus: NutritionFocus): string {
  const nutrients = detection.nutrients;

  if (!nutrients) {
    return 'Nutrient lookup pending';
  }

  switch (focus) {
    case 'protein':
      return `${formatMetric(nutrients.proteinPer100g)}g protein / 100g`;
    case 'lowPotassium':
      return `${formatMetric(nutrients.potassiumMgPer100g)}mg potassium / 100g`;
    case 'balanced':
    case 'carbohydrate':
    default:
      return formatCarbohydrates(nutrients.carbsPer100g);
  }
}

function getCompactFocusMetricLabel(detection: FoodDetection, focus: NutritionFocus): string {
  const nutrients = detection.nutrients;

  if (!nutrients) {
    return 'Loading nutrient info';
  }

  switch (focus) {
    case 'protein':
      return `${formatMetric(nutrients.proteinPer100g)}g protein`;
    case 'lowPotassium':
      return `${formatMetric(nutrients.potassiumMgPer100g)}mg potassium`;
    case 'balanced':
    case 'carbohydrate':
    default:
      return `${formatMetric(nutrients.carbsPer100g)}g carbs`;
  }
}

function formatMetric(value?: number): string {
  if (value === undefined) {
    return '-';
  }

  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

const styles = StyleSheet.create({
  cameraSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#05070B',
  },
  cameraFallback: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#0A0D14',
  },
  cameraFallbackTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  cameraFallbackText: {
    marginTop: 10,
    color: '#A9B3C7',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 12, 17, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#1F2533',
    borderWidth: 1,
    borderColor: '#36405A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#E5EBF9',
    fontWeight: '700',
    fontSize: 13,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  scanGuidance: {
    position: 'absolute',
    top: 88,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(5, 7, 11, 0.72)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 146, 184, 0.35)',
    padding: 14,
    gap: 4,
  },
  scanGuidanceTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scanGuidanceBody: {
    color: '#C0CBE1',
    fontSize: 13,
    lineHeight: 18,
  },
  detectionBox: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 20,
  },
  bestDetectionBox: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
  },
  selectedDetectionBox: {
    borderWidth: 4,
  },
  otherDetectionBox: {
    borderColor: '#F8FAFF',
    backgroundColor: 'rgba(248, 250, 255, 0.08)',
  },
  bestDetectionChip: {
    position: 'absolute',
    top: -3,
    left: -3,
    maxWidth: 180,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.28)',
  },
  otherDetectionChip: {
    position: 'absolute',
    top: -3,
    left: -3,
    maxWidth: 180,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#F8FAFF',
    backgroundColor: 'rgba(248, 250, 255, 0.2)',
  },
  detectionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  detectionMetric: {
    color: '#EEF3FF',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    marginTop: 1,
  },
  cameraFooter: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 44,
    gap: 12,
  },
  focusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  focusButton: {
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(5, 7, 11, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(126, 146, 184, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  focusButtonSelected: {
    borderColor: '#49C6E5',
    backgroundColor: 'rgba(73, 198, 229, 0.24)',
  },
  focusButtonText: {
    color: '#E6EDFA',
    fontSize: 12,
    fontWeight: '700',
  },
  focusButtonTextSelected: {
    color: '#EAFBFF',
  },
  statusCard: {
    backgroundColor: 'rgba(5, 7, 11, 0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(126, 146, 184, 0.25)',
    padding: 14,
    gap: 3,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },
  statusText: {
    color: '#C2CCE1',
    fontSize: 13,
    lineHeight: 18,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0F14',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    gap: 20,
  },
  backgroundShapeTop: {
    position: 'absolute',
    top: -110,
    right: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#2F67FF',
    opacity: 0.25,
  },
  backgroundShapeBottom: {
    position: 'absolute',
    bottom: -110,
    left: -90,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#3ED8B8',
    opacity: 0.16,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1B1E27',
    borderWidth: 1,
    borderColor: '#2B303C',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3ED8B8',
  },
  badgeText: {
    color: '#C6CAD6',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    color: '#F9FBFF',
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B7BECE',
    fontSize: 16,
    lineHeight: 24,
  },
  conceptCard: {
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: '#282D3A',
    borderRadius: 22,
    padding: 18,
    gap: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flowItem: {
    alignItems: 'center',
    width: 88,
    gap: 6,
  },
  flowEmoji: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D2D6E0',
  },
  flowLabel: {
    color: '#D2D6E0',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  flowArrow: {
    color: '#78819A',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    color: '#B5BCD0',
    fontSize: 14,
    lineHeight: 21,
  },
  buttonGroup: {
    gap: 10,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2F67FF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  permissionMessage: {
    color: '#FFB4B4',
    fontSize: 13,
    lineHeight: 18,
  },
  secondaryButton: {
    backgroundColor: '#1A1F2A',
    borderWidth: 1,
    borderColor: '#2E3545',
  },
  secondaryButtonText: {
    color: '#DCE3F2',
    fontWeight: '600',
    fontSize: 15,
  },
});
