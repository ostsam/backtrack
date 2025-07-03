import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Pressable, Linking, Platform } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
  PermissionStatus,
} from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { useBaseline, PoseLandmarks } from "@/context/BaselineContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { detectPose } from "@/utils/detectPose";

export default function PoseCamera() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { setLastPose } = useBaseline();
  const [isCameraReady, setCameraReady] = useState(false);
  const isFocused = useIsFocused();
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [lastFocusTs, setLastFocusTs] = useState<number>(Date.now());

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

  // focus-based camera mount control
  useEffect(() => {
    if (isFocused) {
      console.log("PoseCamera: Screen focused – mounting camera");
      setShowCamera(true);
      setLastFocusTs(Date.now());
    } else {
      console.log("PoseCamera: Screen unfocused – unmounting camera");
      setShowCamera(false);
      setCameraReady(false);
    }
  }, [isFocused]);

  // Capture a still every 2 s and run stub pose detection.
  useEffect(() => {
    if (!hasPermission || !isCameraReady || !isFocused) {
      console.log(
        "PoseCamera: Skipping frame capture - not ready or no permission"
      );
      return;
    }
    console.log("PoseCamera: Starting frame capture interval");
    let capturing = false;
    const id = setInterval(async () => {
      // Wait at least 1s after focus before first capture
      if (Date.now() - lastFocusTs < 1000) {
        return;
      }
      if (capturing) {
        console.log("PoseCamera: Capture still in progress, skipping");
        return;
      }
      if (!cameraRef.current) {
        console.log("PoseCamera: No camera ref available");
        return;
      }
      capturing = true;
      try {
        // @ts-ignore
        const photo: CameraCapturedPicture =
          await cameraRef.current.takePictureAsync({
            base64: true,
            // Disable shutter sound
            skipProcessing: true,
          });
        console.log("PoseCamera: Captured frame");
        // TODO: Replace with real ML Kit integration
        if (!photo.base64) {
          console.warn("PoseCamera: No base64 data in captured image");
        } else {
          const pose: PoseLandmarks = await detectPose(photo.base64);
          console.log(
            "PoseCamera: Detected pose landmarks:",
            Object.keys(pose).length
          );
          setLastPose(pose);
        }
      } catch (err) {
        console.warn("PoseCamera: Pose capture error", err);
      } finally {
        capturing = false;
      }
    }, 2000);
    return () => clearInterval(id);
  }, [hasPermission, isCameraReady, isFocused, setLastPose, lastFocusTs]);

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
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        >
          <ThemedText style={styles.buttonText}>Grant Access</ThemedText>
        </Pressable>
        {permission?.status === PermissionStatus.DENIED && (
          <>
            <ThemedText style={styles.permissionText}>
              If the prompt doesn\'t appear, enable the Camera permission in
              system settings.
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
        )}
      </ThemedView>
    );
  }

  console.log("PoseCamera: Rendering camera view");
  return (
    <View style={StyleSheet.absoluteFill}>
      {showCamera && (
        <CameraView
          key={lastFocusTs} // force remount on each focus
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
          enableTorch={false}
          onCameraReady={() => {
            console.log("PoseCamera: Camera is ready");
            setCameraReady(true);
          }}
        />
      )}
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
