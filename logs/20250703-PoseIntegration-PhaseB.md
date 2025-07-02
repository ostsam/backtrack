# 2025-07-03 – Pose Integration Phase B (Native module)

## Context

Second half of the ML Kit migration: turn the prototype JS bridge into a real **Expo native module** so pose detection runs on-device. This fixes the unlinking error and feeds live landmarks to the overlay.

## Key Additions

### backtrack-pose package (monorepo workspace)

1. **package.json** – defines module, registers config-plugin under `expo.plugins`.
2. **src/index.ts** – exports `detectPose(uri)` via `requireNativeModule("BacktrackPose")`.
3. **ios/BacktrackPoseModule.swift** – Swift Expo-Modules class, wraps `MLKitPoseDetectionAccurate`, returns 5 landmarks.
4. **android/BacktrackPoseModule.kt** – Kotlin Expo-Modules class, wraps `com.google.mlkit:pose-detection-accurate`.
5. **android/build.gradle** – library gradle with `expo.modules.kotlin` plugin, ML Kit dependency, namespace `com.backtrackpose`.
6. **BacktrackPose.podspec** – CocoaPod declaring dependency on `GoogleMLKit/PoseDetectionAccurate`, iOS 14+.
7. **plugin/with-backtrack-pose.js** – config-plugin that inserts the Gradle/Pod deps during `expo prebuild`.
8. **2025-07-03 addendum** – Added `expo-module.config.json` to backtrack-pose so Expo autolinking registers the native module. Without this file the build succeeded but JS couldn't find `BacktrackPose` at runtime.

### JS plumbing

- **utils/nativePose.ts** – now points to `NativeModules.BacktrackPose` (correct key).
- **PoseCamera.tsx** – continues to call `detectPose(uri)`; on success pushes landmarks to context.

## Build instructions (for future reference)

```bash
# install new sub-package
yarn

# regenerate native projects and autolink module
npx expo prebuild --clean

# build & run
npx expo run:android   # or run:ios
```

After installing the fresh dev-client the linking error disappears and the overlay draws in the correct location when ML Kit detects the user.

## Next

- Fine-tune overlay scaling on different aspect ratios.
- Optionally expose colour/thickness constants via settings.
- Implement background task for periodic checks.
