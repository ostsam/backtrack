import React, { useState, useRef } from "react";
import { StyleSheet, View, Pressable, ScrollView, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  testSingleImage,
  performanceTest,
  validateLandmarks,
  TestResult,
} from "@/utils/testPoseDetection";
import { PoseLandmarks } from "@/utils/detectPose";

export default function TestPoseScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [performanceResults, setPerformanceResults] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  // Request permission on mount
  React.useEffect(() => {
    (async () => {
      if (!permission) return;
      if (permission.status === "granted") {
        setHasPermission(true);
      } else if (permission.status === "undetermined") {
        const res = await requestPermission();
        setHasPermission(res.granted);
      } else {
        setHasPermission(false);
      }
    })();
  }, [permission, requestPermission]);

  const captureAndTest = async () => {
    if (!cameraRef.current || isTesting) return;

    setIsTesting(true);
    try {
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: false,
      });

      if (photo.uri) {
        const result = await testSingleImage(photo.uri);
        setLastResult(result);
        setTestHistory((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10 results

        // Validate landmarks if successful
        if (result.success && result.landmarks) {
          const validation = validateLandmarks(result.landmarks);
          if (!validation.valid) {
            Alert.alert("Validation Warning", validation.issues.join("\n"));
          }
        }
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: 0,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const runPerformanceTest = async () => {
    if (!cameraRef.current || isTesting) return;

    setIsTesting(true);
    try {
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: false,
      });

      if (photo.uri) {
        const results = await performanceTest(photo.uri, 5); // 5 iterations for testing
        setPerformanceResults(results);
      }
    } catch (error) {
      Alert.alert(
        "Performance Test Failed",
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setIsTesting(false);
    }
  };

  const testWithSampleImage = async () => {
    // This would test with a known good image
    // For now, we'll use a placeholder
    Alert.alert(
      "Sample Image Test",
      "This would test with a known good image. Add sample images to test this feature."
    );
  };

  const renderLandmarks = (landmarks: PoseLandmarks) => {
    return Object.entries(landmarks).map(([name, point]) => (
      <View key={name} style={styles.landmarkItem}>
        <ThemedText style={styles.landmarkName}>{name}:</ThemedText>
        <ThemedText style={styles.landmarkCoords}>
          ({point.x.toFixed(1)}, {point.y.toFixed(1)})
        </ThemedText>
      </View>
    ));
  };

  const renderTestResult = (result: TestResult) => (
    <View key={result.imageUri || Date.now()} style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <ThemedText
          style={[
            styles.resultStatus,
            result.success ? styles.successText : styles.errorText,
          ]}
        >
          {result.success ? "✅ SUCCESS" : "❌ FAILED"}
        </ThemedText>
        <ThemedText style={styles.resultDuration}>
          {result.duration}ms
        </ThemedText>
      </View>

      {result.error && (
        <ThemedText style={styles.errorText}>{result.error}</ThemedText>
      )}

      {result.landmarks && (
        <View style={styles.landmarksContainer}>
          <ThemedText style={styles.landmarksTitle}>
            Detected Landmarks:
          </ThemedText>
          {renderLandmarks(result.landmarks)}
        </View>
      )}
    </View>
  );

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Pose Detection Test" }} />
        <ThemedText type="title">Camera Permission Required</ThemedText>
        <ThemedText>
          This test requires camera access to capture images for pose detection.
        </ThemedText>
        <Pressable onPress={requestPermission} style={styles.button}>
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Pose Detection Test" }} />

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {hasPermission && (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            enableTorch={false}
          />
        )}
      </View>

      {/* Test Controls */}
      <View style={styles.controlsContainer}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Test Controls
        </ThemedText>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={captureAndTest}
            disabled={isTesting}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && { opacity: 0.7 },
              isTesting && { opacity: 0.5 },
            ]}
          >
            <ThemedText style={styles.buttonText}>
              {isTesting ? "Testing..." : "Capture & Test"}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={runPerformanceTest}
            disabled={isTesting}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && { opacity: 0.7 },
              isTesting && { opacity: 0.5 },
            ]}
          >
            <ThemedText style={styles.buttonText}>Performance Test</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {lastResult && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Latest Result
            </ThemedText>
            {renderTestResult(lastResult)}
          </View>
        )}

        {performanceResults && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Performance Results
            </ThemedText>
            <View style={styles.performanceContainer}>
              <ThemedText>
                Average: {performanceResults.averageDuration.toFixed(0)}ms
              </ThemedText>
              <ThemedText>Min: {performanceResults.minDuration}ms</ThemedText>
              <ThemedText>Max: {performanceResults.maxDuration}ms</ThemedText>
              <ThemedText>
                Success Rate: {performanceResults.successRate.toFixed(1)}%
              </ThemedText>
            </View>
          </View>
        )}

        {testHistory.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Test History
            </ThemedText>
            {testHistory.map(renderTestResult)}
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        >
          <ThemedText style={styles.buttonText}>Back to Monitor</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#5856D6",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  resultContainer: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultStatus: {
    fontWeight: "600",
  },
  resultDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  successText: {
    color: "#30D158",
  },
  errorText: {
    color: "#FF453A",
  },
  landmarksContainer: {
    marginTop: 8,
  },
  landmarksTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  landmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  landmarkName: {
    fontWeight: "500",
  },
  landmarkCoords: {
    opacity: 0.8,
  },
  performanceContainer: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  navigationContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
});
