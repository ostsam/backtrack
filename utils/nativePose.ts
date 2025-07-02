import { requireNativeModule } from "expo-modules-core";
import type { PoseLandmarks } from "@/context/BaselineContext";

/**
 * We rely on Expo Modules autolinking, so the module is exposed via
 * `requireNativeModule('BacktrackPose')`, *not* through React-Native's
 * `NativeModules` bag. Using the helper gives us typed access and a clear
 * error message if the module truly isn't in the binary.
 */

interface BacktrackPoseModule {
  detectPose(uri: string): Promise<PoseLandmarks | null>;
}

// Throwing here lets the redbox show a helpful message when the native side is
// missing (e.g. running in Expo Go, or dev-client wasn't rebuilt).
const PoseModule = requireNativeModule<BacktrackPoseModule>("BacktrackPose");

export async function detectPose(
  fileUri: string
): Promise<PoseLandmarks | null> {
  return PoseModule.detectPose(fileUri);
}
