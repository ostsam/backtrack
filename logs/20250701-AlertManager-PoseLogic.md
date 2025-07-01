# 2025-07-01 – AlertManager & Pose Logic Stub

## Context

Phase-3 task: when the user slouches the app should emit an audible beep (and optional vibration) until posture recovers.

## Changes

1. **AlertManager** (`components/AlertManager.tsx`)
   • Uses `expo-audio` → `createAudioPlayer()` to loop `assets/sounds/alert.mp3`.
   • Configures audio mode so playback works in silent mode on iOS.
   • While `usePose().slouching` is `true`:
   – Starts the looping sound.
   – Triggers heavy haptic impact every 5 s (Android, via `expo-haptics`).
   • Pauses sound & clears vibration timer when posture recovers.
   • Cleanly removes player on unmount.
2. **MonitorScreen**
   • Imported `<AlertManager />` as an invisible child so alerts track live pose status.
3. **PoseCamera** (unchanged from earlier) already supplies synthetic pose data → angle computation.
4. **Docs** – no update needed (alert logic already described in ProjectContext).

## Outcome

• When the synthetic pose crosses the 12° threshold the phone beeps continuously; vibration fires every 5 s on Android.
• Alerts stop immediately once the user sits upright (angle < 10°).

Next: replace synthetic `detectPose` with a real ML Kit bridge.
