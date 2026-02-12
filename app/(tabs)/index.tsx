import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

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
    return (
      <SafeAreaView style={styles.cameraSafeArea}>
        <StatusBar style="light" />
        <CameraView style={styles.cameraView} facing="back">
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>Scanning View</Text>
            <Pressable onPress={() => setIsScanning(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </CameraView>
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

const styles = StyleSheet.create({
  cameraSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraHeader: {
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
