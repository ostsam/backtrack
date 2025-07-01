# 2025-07-01 – Navigation Simplification

## Context

After initial scaffolding we still had the template **Home** and **Explore** tabs left over from the Expo starter. They cluttered the UI and confused early testers – the only screen we need right now is the Posture monitor (with the Calibration modal).

## Changes

1. **Tab Layout**
   • `app/(tabs)/_layout.tsx` – replaced the full tab-bar config with a minimalist navigator that hides the bar and registers only the `index` route.
2. **Root Screen**
   • `app/(tabs)/index.tsx` now simply re-exports `MonitorScreen` so the posture monitor is the default/only screen.
   • Old `posture.tsx` kept as alias but is no longer in the navigation tree.
3. **Welcome/Explore removal**
   • Removed welcome/hello-world UI from `index.tsx` – no sample content ships in the app binary.
4. **Camera lifecycle**
   • `PoseCamera.tsx` updated to unmount/remount the camera when the screen focus changes (fixes "Failed to capture image" errors after navigating away).

## Outcome

• App launches straight into the Posture monitor.
• No visible bottom tab bar.
• Calibration modal still opens via **Re-calibrate** button and returns cleanly.

Next step: implement real pose detection + alert logic.
