# Quick Test Guide - Pose Detection

This is a quick start guide to test the `backtrack-pose` native module. Follow these steps to verify everything is working correctly.

## 🚀 Quick Start (5 minutes)

### Step 1: Setup Environment

```bash
# From the Backtrack directory
npm run test-pose:setup
```

### Step 2: Build Native Module

```bash
npm run test-pose:build
```

### Step 3: Run Tests

```bash
npm run test-pose:test
```

### Step 4: Manual Testing

```bash
npm run test-pose:run
```

## 📱 Manual Testing Steps

1. **Open the app** (after running `npm run test-pose:run`)
2. **Navigate to main screen** - You should see the camera view
3. **Tap "Test Pose Detection"** - Red button (dev mode only)
4. **Grant camera permissions** when prompted
5. **Test basic functionality**:
   - Tap "Capture & Test" to take a photo and detect pose
   - Check that landmarks are displayed
   - Verify coordinates are reasonable (positive numbers)
6. **Run performance test**:
   - Tap "Performance Test"
   - Wait for 5 iterations
   - Check success rate > 80%

## ✅ Success Criteria

### Unit Tests

- All tests pass
- No errors in console

### Manual Tests

- Camera captures images successfully
- Pose detection returns landmarks
- All 4 landmarks detected: leftEye, rightEye, leftShoulder, rightShoulder
- Coordinates are valid (positive numbers, within image bounds)
- Performance test completes with > 80% success rate
- Detection time < 1000ms average

### Visual Indicators

- Test screen loads without errors
- Camera preview displays
- Results show green "SUCCESS" status
- Landmark coordinates are displayed
- Performance metrics are shown

## ❌ Common Issues & Solutions

### Issue: "Cannot find module 'backtrack-pose'"

**Solution**: Run `npm run test-pose:setup` to install the module

### Issue: Camera not working

**Solution**:

1. Check device permissions
2. Restart the app
3. Reset app permissions in device settings

### Issue: No pose detected

**Solution**:

1. Ensure face is clearly visible
2. Check lighting conditions
3. Verify ML Kit dependencies are installed
4. Check native module logs

### Issue: Slow performance

**Solution**:

1. Check image resolution (should be 256x256 minimum)
2. Verify device performance
3. Check ML Kit initialization

## 🔧 Advanced Testing

### Full Test Suite

```bash
npm run test-pose:full
```

This runs setup, build, and tests in sequence.

### Individual Commands

```bash
# Setup only
npm run test-pose:setup

# Build only
npm run test-pose:build

# Test only
npm run test-pose:test

# Run app only
npm run test-pose:run
```

### Manual Script Usage

```bash
node scripts/test-pose-detection.js <command>
```

## 📊 Expected Results

### Performance Targets

- **Detection Time**: < 500ms average
- **Success Rate**: > 90% (good conditions)
- **Memory Usage**: < 100MB
- **Landmark Accuracy**: All 4 landmarks detected

### Test Scenarios

1. **Good Lighting**: All landmarks detected
2. **Poor Lighting**: At least 2 landmarks detected
3. **Different Poses**: Coordinates change appropriately
4. **Distance Variations**: Works within 1-3 feet range

## 🐛 Debugging

### Enable Debug Logs

The test screen shows detailed logs in the console. Look for:

- `🧪 Testing pose detection with image:`
- `✅ Pose detected successfully in Xms`
- `📍 Landmarks found:`
- `📊 Landmark details:`

### Check Native Module

If issues persist, verify the native module:

1. Check `backtrack-pose` directory exists
2. Verify ML Kit dependencies are installed
3. Check platform-specific build files

### Platform-Specific Issues

- **iOS**: Check Podfile and ML Kit pod installation
- **Android**: Check build.gradle and ML Kit dependencies

## 📝 Reporting Issues

When reporting issues, include:

1. **Environment**: Device, OS version, app version
2. **Steps**: Exact steps to reproduce
3. **Expected vs Actual**: What should happen vs what happened
4. **Logs**: Console output and error messages
5. **Screenshots**: If applicable

## 🎯 Next Steps

After successful testing:

1. **Integration**: Test with main app functionality
2. **Performance**: Monitor real-world usage
3. **Optimization**: Tune detection parameters
4. **User Testing**: Get feedback from real users

For detailed testing instructions, see: `docs/TestingGuide.md`
