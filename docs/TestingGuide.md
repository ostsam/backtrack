# Pose Detection Testing Guide

This guide covers comprehensive testing strategies for the `backtrack-pose` native module and its integration with the main app.

## Testing Overview

### 1. Unit Testing

- **Purpose**: Test individual functions and components in isolation
- **Tools**: Jest, React Native Testing Library
- **Location**: `Backtrack/utils/__tests__/`

### 2. Integration Testing

- **Purpose**: Test the full pipeline from camera capture to pose detection
- **Tools**: Manual testing via test screen
- **Location**: `Backtrack/app/test-pose.tsx`

### 3. Manual Testing

- **Purpose**: Real-world testing with actual camera input
- **Tools**: Device camera, test screen
- **Scenarios**: Various lighting conditions, poses, distances

### 4. Performance Testing

- **Purpose**: Measure detection speed and resource usage
- **Tools**: Built-in performance test in test screen
- **Metrics**: Average time, min/max times, success rate

## Testing Setup

### Prerequisites

1. **Development Environment**
   - Expo CLI installed
   - iOS Simulator or Android Emulator
   - Physical device for camera testing

2. **Dependencies**
   - `expo-camera` for image capture
   - `expo-file-system` for file operations
   - Jest for unit testing

3. **Native Module**
   - `backtrack-pose` module built and linked
   - ML Kit dependencies installed

### Build Commands

```bash
# Build the native module
cd backtrack-pose
npm run build

# Install in main app
cd ../Backtrack
npm install ../backtrack-pose

# Run the app
npx expo start
```

## Testing Procedures

### Step 1: Unit Tests

Run the unit tests to verify basic functionality:

```bash
cd Backtrack
npm test
```

**Expected Results:**

- All tests should pass
- Native module interface should be properly mocked
- Error handling should work correctly

### Step 2: Integration Testing

1. **Launch the test screen**
   - Open the app in development mode
   - Navigate to the main monitor screen
   - Tap "Test Pose Detection" button (dev mode only)

2. **Basic Functionality Test**
   - Grant camera permissions
   - Tap "Capture & Test" button
   - Verify results are displayed
   - Check landmark coordinates are valid

3. **Performance Test**
   - Tap "Performance Test" button
   - Wait for 5 iterations to complete
   - Review performance metrics
   - Success rate should be > 80%

### Step 3: Manual Testing Scenarios

#### Scenario 1: Good Lighting

- **Setup**: Well-lit environment, face clearly visible
- **Expected**: All landmarks detected, coordinates reasonable
- **Success Criteria**: 4 landmarks detected, coordinates within image bounds

#### Scenario 2: Poor Lighting

- **Setup**: Dim lighting, face partially visible
- **Expected**: Some landmarks may be missing or inaccurate
- **Success Criteria**: At least 2 landmarks detected

#### Scenario 3: Different Poses

- **Setup**: Test various head positions (straight, tilted, turned)
- **Expected**: Landmarks should adjust accordingly
- **Success Criteria**: Coordinates change appropriately with pose

#### Scenario 4: Distance Variations

- **Setup**: Test at different distances from camera
- **Expected**: Detection works at various distances
- **Success Criteria**: Detection works within 1-3 feet range

#### Scenario 5: Multiple People

- **Setup**: Multiple faces in frame
- **Expected**: Detects the most prominent face
- **Success Criteria**: Consistent detection of primary subject

### Step 4: Error Handling Tests

#### Test 1: Invalid Image URI

- **Action**: Pass non-existent file path
- **Expected**: Graceful error handling
- **Success Criteria**: Error message displayed, app doesn't crash

#### Test 2: Corrupted Image

- **Action**: Use corrupted image file
- **Expected**: Error or null result
- **Success Criteria**: App handles gracefully

#### Test 3: No Face in Image

- **Action**: Capture image without face
- **Expected**: Null result or error
- **Success Criteria**: Clear indication no pose detected

### Step 5: Performance Validation

#### Baseline Performance

- **Target**: < 500ms average detection time
- **Target**: > 90% success rate
- **Target**: < 100MB memory usage

#### Stress Testing

- **Action**: Rapid successive captures
- **Expected**: Consistent performance
- **Success Criteria**: No memory leaks, stable performance

## Test Results Interpretation

### Success Indicators

✅ **Detection Time**: < 500ms average
✅ **Success Rate**: > 90% for good conditions
✅ **Landmark Accuracy**: All 4 landmarks detected
✅ **Coordinate Validity**: Positive numbers, within image bounds
✅ **Error Handling**: Graceful degradation

### Warning Signs

⚠️ **Slow Detection**: > 1000ms average time
⚠️ **Low Success Rate**: < 70% success rate
⚠️ **Missing Landmarks**: Only 1-2 landmarks detected
⚠️ **Invalid Coordinates**: Negative or NaN values
⚠️ **Memory Issues**: Increasing memory usage over time

### Failure Indicators

❌ **Crashes**: App crashes during detection
❌ **No Detection**: 0% success rate
❌ **Invalid Data**: Wrong data types returned
❌ **Memory Leaks**: Unbounded memory growth

## Debugging Common Issues

### Issue 1: Native Module Not Found

**Symptoms**: "Cannot find module 'backtrack-pose'" error
**Solutions**:

1. Verify module is built: `cd backtrack-pose && npm run build`
2. Check installation: `cd Backtrack && npm list backtrack-pose`
3. Reinstall: `npm install ../backtrack-pose`

### Issue 2: Camera Permission Denied

**Symptoms**: Camera not working, permission errors
**Solutions**:

1. Check device settings
2. Reset app permissions
3. Reinstall app

### Issue 3: Slow Performance

**Symptoms**: Detection taking > 1000ms
**Solutions**:

1. Check image resolution (should be 256x256 minimum)
2. Verify ML Kit is properly initialized
3. Check device performance

### Issue 4: No Pose Detected

**Symptoms**: Always returns null
**Solutions**:

1. Check lighting conditions
2. Ensure face is clearly visible
3. Verify ML Kit dependencies are installed
4. Check native module logs

## Testing Checklist

### Pre-Testing

- [ ] Development environment set up
- [ ] Native module built and installed
- [ ] App builds successfully
- [ ] Camera permissions granted

### Unit Tests

- [ ] All unit tests pass
- [ ] Mock functions work correctly
- [ ] Error handling tested
- [ ] Interface validation works

### Integration Tests

- [ ] Test screen loads correctly
- [ ] Camera capture works
- [ ] Pose detection returns results
- [ ] Performance test completes
- [ ] Results display correctly

### Manual Tests

- [ ] Good lighting scenario
- [ ] Poor lighting scenario
- [ ] Different poses tested
- [ ] Distance variations tested
- [ ] Error scenarios handled

### Performance Validation

- [ ] Detection time < 500ms
- [ ] Success rate > 90%
- [ ] Memory usage stable
- [ ] No crashes during stress test

### Final Validation

- [ ] All tests pass
- [ ] Performance meets targets
- [ ] Error handling robust
- [ ] User experience smooth

## Reporting Test Results

When reporting test results, include:

1. **Environment Details**
   - Device/emulator used
   - OS version
   - App version
   - Development mode

2. **Test Results**
   - Unit test results
   - Integration test results
   - Performance metrics
   - Manual test outcomes

3. **Issues Found**
   - Description of issues
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

4. **Recommendations**
   - Suggested improvements
   - Performance optimizations
   - User experience enhancements

## Continuous Testing

For ongoing development:

1. **Automated Tests**: Run unit tests before each commit
2. **Integration Tests**: Test new features with real camera input
3. **Performance Monitoring**: Track performance metrics over time
4. **User Feedback**: Collect feedback from real-world usage

This testing framework ensures the pose detection module is robust, performant, and reliable for production use.
