# Backtrack App Context

## Recent Changes

### 2024-12-19: Camera Shutter Sound Disable Implementation

**Original Request**: Disable camera shutter sound that occurs when photos are taken for pose detection.

**Implementation**:

1. **Android Manifest**: Added camera feature declarations and permissions
2. **iOS Info.plist**: Added `UIShowsShutterSound: false` key
3. **PoseCamera Component**: Updated `takePictureAsync` options with `skipProcessing: true` and reduced quality

**Platform Limitations**:

- **Android**: Shutter sounds may still occur due to regional legal requirements (Japan, Korea) or device manufacturer settings
- **iOS**: Shutter sounds are typically mandatory and cannot be disabled programmatically due to privacy laws
- **Workaround**: Users may need to enable silent mode on their device or adjust system camera settings

**Technical Details**:

- Using `expo-camera` version ~16.1.0
- Frame capture occurs every 2 seconds for pose detection
- Reduced image quality to 0.5 for faster processing
- Added `skipProcessing: true` to minimize camera operations

**Testing Required**:

- Test on various Android devices and regions
- Test on iOS devices (likely will still have shutter sound)
- Verify pose detection accuracy with reduced image quality
