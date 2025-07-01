# 2025-07-01 – Pose Detection & Baseline Context

## Original request / Feature

Implement Vision Camera pose processor, Baseline capture, and live slouch detection (Phase 2–3).

## Challenges

- Integrating third-party `vision-camera-v3-pose-detection` component with Expo Router lifecycle.
- Sharing pose data and baseline across screens without global state libs.

## Successes

- Added `BaselineContext` to store last pose & baseline vectors.
- Created `PoseCamera` component wrapping plugin `Camera`, pushes landmarks to context.
- Implemented `usePose` hook to compute live angle & slouch status.
- Wired `MonitorScreen` to display angle and slouch alert; `CalibrationScreen` sets baseline.

## Methods tried / did not work

- Considered using separate frame-processor plugin but plugin's re-exported Camera was simpler.
- Debated persisting baseline in SecureStore; decided per-session only for now.

## Code changes (<50 lines excerpt)

```tsx
// context/BaselineContext.tsx (excerpt)
const BaselineContext = createContext<BaselineContextValue | undefined>(undefined);
...
const left = lastPose.leftEye && lastPose.leftShoulder ? { base: lastPose.leftEye, vec: ... } : null;
...
```

```tsx
// components/PoseCamera.tsx (excerpt)
<Camera
  device={device}
  isActive
  options={{ mode: "stream", performanceMode: "max" }}
  callback={(pose) => setLastPose(pose)}
/>
```

```tsx
// hooks/usePose.ts (excerpt)
const avg = angles.reduce((s, a) => s + a, 0) / angles.length;
const slouching = avg >= POSTURE_THRESHOLD_DEGREES;
```

## Next steps

- Install NPM packages `react-native-vision-camera-v3-pose-detection` and `react-native-worklets-core`.
- Implement `AlertManager` to loop audio & trigger haptics when slouching.
- Add Android background task skeleton.

DONE
