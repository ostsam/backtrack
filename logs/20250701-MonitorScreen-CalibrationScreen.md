# 2025-07-01 – MonitorScreen & CalibrationScreen Scaffolding

## Original request / Feature

Begin phase 1: scaffold screens & navigation (tabs + modal).

## Challenges

- Integrating new screens into Expo Router structure while keeping existing tabs intact.
- Ensuring modal presentation works across platforms.

## Successes

- Added **Posture** tab with `MonitorScreen`.
- Created modal **CalibrationScreen** accessible via `/calibrate` route.
- Defined posture-related constants for reuse.

## Methods tried

- Chose Expo Router `Stack.Screen` option `presentation: 'modal'` to present calibration as modal (works iOS & Android).
- Used Pressable + ThemedText for buttons to avoid extra dependencies.

## Next steps

- Implement `PoseProcessor` with Vision Camera frame processor.
- Add baseline context and hook to store calibration data.
- Wire live angle to `MonitorScreen`.

DONE
