# 2025-07-02 – Pose Integration Phase A (JS plumbing)

## Context

Transition from the synthetic `detectPose` stub to the real on-device ML Kit detector (Option A: custom Expo module). First step was preparing the JS layer and UI so that the new native bridge can drop in without UI changes.

## Changes

1. **Capture cadence**
   - `constants/Posture.ts` – default frame interval raised to **5 s** (battery-friendly).

2. **Frame dimension wiring**
   - `BaselineContext` – added `lastFrameSize` + setter so any component can convert landmark pixels → screen coords.
   - `PoseCamera` – after each `takePictureAsync()` stores `photo.width/height` into context.

3. **Overlay accuracy**
   - `PoseOverlay.tsx` – now scales landmarks using the actual frame size instead of hard-coded 720×1280, so the lines sit on the user.

4. **Native bridge façade**
   - `utils/nativePose.ts` – JS wrapper that calls `NativeModules.BacktrackPoseModule.detectPose(uri)` and throws a helpful linking error if the native side is missing.
   - `PoseCamera` – now imports `detectPose` from `nativePose`, passes the **file URI** (no more base64), and handles a `null` result.

5. **Housekeeping**
   - Removed unused import warnings, kept overlay styling constants in one place for easy theming.

## Next Steps

- **Phase B** – Scaffold the actual "backtrack-pose" Expo module:
  1. JS/TS entry with `detectPose(uri)` export.
  2. iOS Swift implementation using `GoogleMLKit/PoseDetectionAccurate`.
  3. Android Kotlin implementation using `com.google.mlkit:pose-detection-accurate`.
  4. Config-plugin to autolink both deps (platform iOS 14+).
  5. Delete old `utils/detectPose.ts` stub once native bridge is in.

When Phase B lands, the linking error will vanish and the overlay will start following the real user.
