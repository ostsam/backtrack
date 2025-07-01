# Backtrack – Project Context

## Goal

Backtrack is an Expo SDK 53 (custom dev-client) mobile app that **warns users when they slouch** using on-device pose detection. It plays an audible alert (and optional vibration) while poor posture persists. The app works as follows: the user keeps their phone upright on their desk, and the front-facing camera looks at the user to analyze their posture. At the beginning of every session the user runs a calibration so that the app has a baseline for what constitutes good posture. When there are deviations from said posture, the app emits a beeping sound to notify the user that they should stop slouching.

## Runtime & Tooling

- **Expo SDK 53** with **custom dev-client** (New Architecture: Fabric + TurboModules)
- **React 19 / React Native 0.79+**
- **Node 20** tool-chain
- **TypeScript** with `strict` enabled

## Core Libraries

| Domain                   | Library                                      | Purpose                                                                 |
| ------------------------ | -------------------------------------------- | ----------------------------------------------------------------------- |
| Camera & Pose            | `expo-camera` (legacy API)                   | Capture front camera frames (1 every 2 s) to feed ML Kit pose detection |
|                          | _Planned_: ML Kit JS bridge                  | Analyse poses and return landmarks                                      |
| Alerts                   | `expo-audio`                                 | Loop `alert.mp3` while slouch persists                                  |
|                          | `expo-haptics`                               | Optional vibration on Android                                           |
| Persistence              | `expo-secure-store`                          | Store per-session baseline + settings                                   |
| Background (Android/iOS) | `expo-background-task` + `expo-task-manager` | Periodic posture checks                                                 |

## Permissions

- **Camera**: `Camera.getCameraPermissionStatus` → `requestCameraPermission()` flow
- **Microphone** not needed (playback only)

## Posture Model

1. **Landmarks used**: `leftShoulder`, `rightShoulder`, `leftEye`, `rightEye`, `nose`.
2. **Baseline capture**: User sits upright and taps **Set Baseline**. We store:
   - Shoulder line vector (left→right)
   - Eye-to-shoulder vectors (leftEye→leftShoulder, rightEye→rightShoulder)
3. **Slouch metric**:
   - For each frame, compute angle between live eye-to-shoulder vector and baseline counterpart.
   - Compute average of left & right sides.
4. **Threshold**: `slouch if Δθ ≥ 12°` (default). Constant exported from `constants/Posture.ts`; user-adjustable 8–20 °.
5. **Head level component**: Lateral head tilt (roll) ≥ 5 ° is considered slouch too—measured via eye-to-nose-to-eye vector alignment. Forward and lateral angles are evaluated together.

## Alert Logic

- When slouch detected ⇒ start/continue looping **alert.mp3** (via `expo-audio`).
- One audio instance only; persists until posture recovers (`Δθ ≤ 10°` due to 2° hysteresis).
- Android: optional vibration burst every 5 s using `expo-haptics`.

## Frame Capture Strategy

- **Front camera**, high resolution (e.g., 720p).
- To conserve battery, **capture + process one frame every 2 s** by default (user-adjustable 1–10 s).
- Uses Vision Camera frame processor; zero JS frame overhead.

## UI Flow

1. **Posture Monitor** (root screen)
   - Live camera preview in the background.
   - Angle read-out (degrees) + slouch indicator.
   - **Re-calibrate** button opens Calibration modal.
2. **Calibration Modal** (`/calibrate` route)
   - Live preview, **Set Baseline** button, success confirmation.

> The bottom tab bar was removed — navigation is currently limited to the monitor screen and the calibration modal. Additional screens will be re-introduced later as needed.

## File/Folder Conventions

```
app/
  screens/
    CalibrationScreen.tsx
    MonitorScreen.tsx
  components/
    PoseProcessor.ts
    AlertManager.ts
  hooks/
    usePose.ts
  context/
    BaselineContext.tsx
assets/
  alert.mp3
```

`/docs` contains this file + per-component context files (`CalibrationScreen.context.md`, etc.)

## Phased Implementation Plan

1. **Scaffold screens & navigation** (tabs + modal).
2. **Pose detection pipeline** (PoseProcessor, usePose hook).
3. **Calibration workflow** (BaselineContext, SecureStore).
4. **Slouch detection & alert manager** (audio + haptics).
5. **Battery optimisations** (frame interval tuning).
6. **Android background checks** (TaskManager).
7. **Testing & threshold fine-tuning**.
8. **Docs & cleanup**.

---

Next per-component context files will document detailed changes and future work as they are implemented.

## Documentation

The project relies on the following official guides:

| Topic                                 | Link                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| ML Kit Pose Detection                 | https://developers.google.com/ml-kit/vision/pose-detection              |
| React Native Vision Camera            | https://react-native-vision-camera.com/docs/guides                      |
| VisionCamera V3 Pose Detection Plugin | https://github.com/gev2002/react-native-vision-camera-v3-pose-detection |
| VisionCamera + TFLite Blog            | https://mrousavy.com/blog/VisionCamera-Pose-Detection-TFLite            |
| Expo Audio                            | https://docs.expo.dev/versions/latest/sdk/audio/                        |
| Expo Haptics                          | https://docs.expo.dev/versions/latest/sdk/haptics/                      |
| Expo SecureStore                      | https://docs.expo.dev/versions/latest/sdk/securestore/                  |
| Expo BackgroundTask                   | https://docs.expo.dev/versions/latest/sdk/background-task/              |
