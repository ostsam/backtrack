import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Pressable } from "react-native";

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

      <PoseCamera />

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  angleText: {
    fontSize: 32,
  },
  calibrateBtn: {
    marginTop: 24,
  },
});
