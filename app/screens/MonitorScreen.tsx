import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PoseCamera from "@/components/PoseCamera";
import { usePose } from "@/hooks/usePose";

export default function MonitorScreen() {
  const router = useRouter();
  const { angle, slouching } = usePose();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Posture" }} />

      {/* Camera container with debug border */}
      <View style={styles.cameraContainer}>
        <PoseCamera />
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
      </View>
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
});
