import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useBaseline, PoseLandmarks } from "@/context/BaselineContext";
import { Camera as PoseCameraRaw } from "react-native-vision-camera-v3-pose-detection";
import {
  Camera as BaseCamera,
  useCameraDevices,
} from "react-native-vision-camera";

export default function PoseCamera() {
  const { setLastPose } = useBaseline();
  const { front: device } = useCameraDevices() as any;

  useEffect(() => {
    (async () => {
      // @ts-ignore union mismatch in VisionCamera types
      const status = await BaseCamera.getCameraPermissionStatus();
      // @ts-ignore compare with literal string
      if (status !== "authorized") {
        await BaseCamera.requestCameraPermission();
      }
    })();
  }, []);

  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <PoseCameraRaw
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        options={{ mode: "stream", performanceMode: "max" }}
        callback={(pose: PoseLandmarks) => setLastPose(pose)}
      />
    </View>
  );
}
