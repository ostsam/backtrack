# 2025-07-01 – Camera Library Migration

## Context

Replaced `react-native-vision-camera` with `expo-camera` to regain compatibility with Expo SDK 53 / React Native 0.79. VisionCamera's internal Frame Processor APIs now hard-depend on restricted New-Architecture classes that break the build.

## Changes

1. **Dependencies**
   • removed `react-native-vision-camera`, `react-native-worklets-core`
   • added `expo-camera@~16.1.0`
2. **Config**
   • Updated `app.json` – added expo-camera config plugin, removed vision-camera.
3. **PoseCamera**
   • Re-implemented using `expo-camera/legacy`.
   • Captures a still every 2 s via `takePictureAsync({ base64 })` and forwards the base64 string to the (stub) `detectPose` bridge.
4. **Docs**
   • Updated `/docs/ProjectContext.md` core-libraries table.
5. **Cleanup**
   • Deleted native VisionCamera patch hacks.

## Next Steps

• Implement ML Kit bridge (`detectPose`) in JS or via Expo Modules.
• Consider migrating to `expo-camera` **next** API once stable frame-processor hooks land.
