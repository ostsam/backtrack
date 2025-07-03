import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBaseline } from "@/context/BaselineContext";
import BacktrackPose from "@/modules/backtrack-pose";

export default function CalibrationScreen() {
  const router = useRouter();
  const { setBaseline } = useBaseline();

  const handleSetBaseline = () => {
    setBaseline();
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Calibration", presentation: "modal" }} />
      <ThemedText type="title">Sit Up Straight</ThemedText>
      <ThemedText style={styles.instructions}>
        Align yourself so the camera sees your shoulders and eyes, then tap Set
        Baseline.
        <Text>{BacktrackPose.hello()}</Text>
      </ThemedText>
      <Pressable
        onPress={handleSetBaseline}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
      >
        <ThemedText type="defaultSemiBold">Set Baseline</ThemedText>
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
  instructions: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
