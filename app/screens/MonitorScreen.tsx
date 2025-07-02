import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PoseCamera from "@/components/PoseCamera";
import PoseOverlay from "@/components/PoseOverlay";
import { usePose } from "@/hooks/usePose";
import AlertManager from "@/components/AlertManager";
import { useBaseline } from "@/context/BaselineContext";

const FAKE_SLUMP_POSE = {
  leftEye: { x: 100, y: 100 },
  rightEye: { x: 200, y: 100 },
  leftShoulder: { x: 50, y: 250 },
  rightShoulder: { x: 250, y: 250 },
};

const FAKE_UPRIGHT_POSE = {
  leftEye: { x: 100, y: 100 },
  rightEye: { x: 200, y: 100 },
  leftShoulder: { x: 100, y: 200 },
  rightShoulder: { x: 200, y: 200 },
};

export default function MonitorScreen() {
  const router = useRouter();
  const { angle, slouching } = usePose();
  const { setLastPose, baseline, setBaseline } = useBaseline();
  const [debugSlouch, setDebugSlouch] = React.useState(false);

  const toggleDebugSlouch = () => {
    const next = !debugSlouch;
    setDebugSlouch(next);

    if (!baseline) {
      // Establish baseline first using upright pose
      setLastPose(FAKE_UPRIGHT_POSE);
      // Delay baseline capture to the next tick so lastPose is updated
      setTimeout(() => {
        setBaseline();
      }, 0);
    }

    setLastPose(next ? FAKE_SLUMP_POSE : FAKE_UPRIGHT_POSE);
  };

  React.useEffect(() => {
    if (!debugSlouch) return;
    const id = setInterval(() => setLastPose(FAKE_SLUMP_POSE), 250);
    return () => clearInterval(id);
  }, [debugSlouch, setLastPose]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Posture" }} />

      {/* Camera container with debug border */}
      <View style={styles.cameraContainer}>
        <PoseCamera />
        {/* Draw landmark lines on top of the live preview */}
        <PoseOverlay />
      </View>

      <View style={styles.overlay}>
        <ThemedText type="title">Posture Monitor</ThemedText>
        <ThemedText style={styles.angleText}>
          {angle !== null ? `Live Angle: ${angle.toFixed(1)}°` : "Detecting…"}
        </ThemedText>
        {slouching && (
          <ThemedText type="subtitle" style={{ color: "red" }}>
            Slouching!
          </ThemedText>
        )}

        <Pressable
          onPress={() => router.push("/calibrate")}
          style={({ pressed }) => [
            styles.calibrateBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText type="defaultSemiBold">Re-calibrate</ThemedText>
        </Pressable>

        {__DEV__ && (
          <Pressable
            onPress={toggleDebugSlouch}
            style={({ pressed }) => [
              styles.debugBtn,
              debugSlouch && { backgroundColor: "#FF9500" },
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText type="defaultSemiBold">
              {debugSlouch ? "Stop Slouch" : "Sim Slouch"}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {/* Invisible component that handles audio/haptics alerts */}
      <AlertManager />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    borderColor: "red", // Debug border
    borderWidth: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  angleText: {
    fontSize: 32,
  },
  calibrateBtn: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  debugBtn: {
    marginTop: 12,
    backgroundColor: "#5856D6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
