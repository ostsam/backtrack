import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Pressable, Linking, Platform } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
  PermissionStatus,
} from "expo-camera";
import { useBaseline, PoseLandmarks } from "@/context/BaselineContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function PoseCamera() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { setLastPose } = useBaseline();

  // Request permission on mount
  useEffect(() => {
    (async () => {
      console.log("PoseCamera: Checking camera permission status...");
      if (!permission) {
        console.log("PoseCamera: No permission state yet");
        return;
      }
      if (permission.status === "granted") {
        console.log("PoseCamera: Permission already granted");
        setHasPermission(true);
      } else if (permission.status === "undetermined") {
        console.log("PoseCamera: Requesting camera permission...");
        const res = await requestPermission();
        console.log("PoseCamera: Permission request result:", res.granted);
        setHasPermission(res.granted);
      } else {
        console.log("PoseCamera: Permission denied");
        setHasPermission(false);
      }
    })();
  }, [permission, requestPermission]);

  // Capture a still every 2 s and run stub pose detection.
  useEffect(() => {
    if (!hasPermission) {
      console.log("PoseCamera: Skipping frame capture - no permission");
      return;
    }
    console.log("PoseCamera: Starting frame capture interval");
    const id = setInterval(async () => {
      if (!cameraRef.current) {
        console.log("PoseCamera: No camera ref available");
        return;
      }
      try {
        // @ts-ignore – type not yet in CameraViewRef typings
        const photo: CameraCapturedPicture =
          await cameraRef.current.takePictureAsync({
            base64: true,
            skipProcessing: true,
          });
        console.log("PoseCamera: Captured frame");
        // TODO: Replace with real ML Kit integration
        // For now, use a global stub `detectPoseFromBase64` if available.
        let pose: PoseLandmarks = {};
        // @ts-ignore
        if (typeof detectPose === "function") {
          // @ts-ignore
          pose = (await detectPose(photo.base64)) as PoseLandmarks;
          console.log(
            "PoseCamera: Detected pose landmarks:",
            Object.keys(pose).length
          );
        } else {
          console.log("PoseCamera: No detectPose function available yet");
        }
        setLastPose(pose);
      } catch (err) {
        console.warn("PoseCamera: Pose capture error", err);
      }
    }, 2000);
    return () => clearInterval(id);
  }, [hasPermission, setLastPose]);

  const openSettings = async () => {
    if (Platform.OS === "ios") {
      await Linking.openURL("app-settings:");
    } else {
      await Linking.openSettings();
    }
  };

  if (hasPermission === false) {
    console.log("PoseCamera: Rendering permission request UI");
    return (
      <ThemedView style={styles.permissionContainer}>
        <ThemedText type="title" style={styles.permissionTitle}>
          Camera Access Needed
        </ThemedText>
        <ThemedText style={styles.permissionText}>
          Backtrack needs camera access to monitor your posture. The camera will
          only be used to detect your pose and help you maintain good posture.
        </ThemedText>
        {permission?.status === PermissionStatus.DENIED ? (
          <>
            <ThemedText style={styles.permissionText}>
              Please enable camera access in your device settings.
            </ThemedText>
            <Pressable
              onPress={openSettings}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText style={styles.buttonText}>Open Settings</ThemedText>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText style={styles.buttonText}>Grant Access</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    );
  }

  console.log("PoseCamera: Rendering camera view");
  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
        enableTorch={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  permissionTitle: {
    marginBottom: 16,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
