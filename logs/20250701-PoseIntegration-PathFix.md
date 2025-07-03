# 2025-07-04 – Pose Integration: Fix module path

## Issue

`NativeModules.BacktrackPose` remained undefined at runtime even after adding the native code. We discovered the JS dependency was declared as:

```json
"backtrack-pose": "file:backtrack-pose"
```

But the **backtrack-pose** package actually lives as a _sibling_ of the Expo project folder (`Backtrack/`). Yarn therefore installed an **empty stub** (pointing to a non-existent sub-folder) and autolinking never saw the native sources.

## Fix

1. In `Backtrack/package.json` change the path to point one level up:

```diff
-"backtrack-pose": "file:backtrack-pose"
+"backtrack-pose": "file:../backtrack-pose"
```

2. Removed the temporary `workspaces` field – not needed when we reference the local folder directly.

## Re-build steps

```bash
rm -rf node_modules yarn.lock   # ensure a clean install
yarn                             # installs the real backtrack-pose package
EXPO_DEBUG=1 npx expo prebuild --clean   # autolink logs should list "✅  backtrack-pose"
npx expo run:android|ios        # dev-client with native module
```

Autolinking should now add `:backtrack-pose` to **settings.gradle** and compile the Kotlin/Swift sources into the binary, resolving the linking error.

- **JS bridge update** – `utils/nativePose.ts` now calls `requireNativeModule('BacktrackPose')` (the correct Expo Modules entry point) instead of looking in `NativeModules.*`. This removes the false "not linked" error once the module is in the binary.

* **Android build fix** – changed `backtrack-pose/android/build.gradle` to use `id("expo-module")` (the plugin autolinking relies on) instead of the old `expo.modules.kotlin`.

* **Android plugin syntax** – `backtrack-pose/android/build.gradle` now uses Kotlin-DSL style `id("expo-module")` and property assignments (`compileSdk = 34`) so the autolinker's regex recognises the plugin and inserts the module into `settings.gradle`.

* **Emergency include** – added `include ':backtrack-pose'` to `android/settings.gradle` so Gradle compiles the module while we diagnose autolinker pattern issues.
