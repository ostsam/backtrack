import { detectPose, PoseLandmarks } from "./detectPose";
import * as FileSystem from "expo-file-system";

export interface TestResult {
  success: boolean;
  landmarks?: PoseLandmarks;
  error?: string;
  duration: number;
  imageUri?: string;
}

export interface TestCase {
  name: string;
  imageUri: string;
  expectedLandmarks?: string[]; // Array of expected landmark names
  shouldFail?: boolean;
}

/**
 * Test the pose detection with a single image
 */
export async function testSingleImage(imageUri: string): Promise<TestResult> {
  const startTime = Date.now();

  try {
    console.log(`🧪 Testing pose detection with image: ${imageUri}`);

    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      return {
        success: false,
        error: `Image file does not exist: ${imageUri}`,
        duration: Date.now() - startTime,
        imageUri,
      };
    }

    console.log(`📁 Image file size: ${fileInfo.size} bytes`);

    // Test pose detection
    const landmarks = await detectPose(imageUri);

    const duration = Date.now() - startTime;

    if (landmarks) {
      console.log(`✅ Pose detected successfully in ${duration}ms`);
      console.log(`📍 Landmarks found:`, Object.keys(landmarks));
      console.log(`📊 Landmark details:`, landmarks);

      return {
        success: true,
        landmarks,
        duration,
        imageUri,
      };
    } else {
      console.log(`⚠️ No pose detected in ${duration}ms`);
      return {
        success: false,
        error: "No pose detected",
        duration,
        imageUri,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Pose detection failed:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration,
      imageUri,
    };
  }
}

/**
 * Run multiple test cases
 */
export async function runTestSuite(
  testCases: TestCase[]
): Promise<TestResult[]> {
  console.log(`🧪 Running test suite with ${testCases.length} test cases`);

  const results: TestResult[] = [];

  for (const testCase of testCases) {
    console.log(`\n📋 Running test: ${testCase.name}`);
    const result = await testSingleImage(testCase.imageUri);

    // Validate expected landmarks if specified
    if (testCase.expectedLandmarks && result.landmarks) {
      const foundLandmarks = Object.keys(result.landmarks);
      const missingLandmarks = testCase.expectedLandmarks.filter(
        (landmark) => !foundLandmarks.includes(landmark)
      );

      if (missingLandmarks.length > 0) {
        result.success = false;
        result.error = `Missing expected landmarks: ${missingLandmarks.join(", ")}`;
      }
    }

    // Check if test should have failed
    if (testCase.shouldFail && result.success) {
      result.success = false;
      result.error = "Test should have failed but succeeded";
    }

    results.push(result);
  }

  // Print summary
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const avgDuration =
    results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log(`\n📊 Test Suite Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️ Average duration: ${avgDuration.toFixed(0)}ms`);

  return results;
}

/**
 * Test with camera capture (for manual testing)
 */
export async function testWithCameraCapture(
  captureImage: () => Promise<string>
): Promise<TestResult> {
  console.log(`📸 Testing with live camera capture`);

  try {
    const imageUri = await captureImage();
    return await testSingleImage(imageUri);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: 0,
    };
  }
}

/**
 * Performance test - run multiple detections and measure performance
 */
export async function performanceTest(
  imageUri: string,
  iterations: number = 10
): Promise<{
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  successRate: number;
  results: TestResult[];
}> {
  console.log(`⚡ Running performance test with ${iterations} iterations`);

  const results: TestResult[] = [];
  let successCount = 0;

  for (let i = 0; i < iterations; i++) {
    console.log(`🔄 Iteration ${i + 1}/${iterations}`);
    const result = await testSingleImage(imageUri);
    results.push(result);

    if (result.success) {
      successCount++;
    }

    // Small delay between iterations
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const durations = results.map((r) => r.duration);
  const averageDuration =
    durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const successRate = (successCount / iterations) * 100;

  console.log(`\n📈 Performance Results:`);
  console.log(`⏱️ Average: ${averageDuration.toFixed(0)}ms`);
  console.log(`⚡ Min: ${minDuration}ms`);
  console.log(`🐌 Max: ${maxDuration}ms`);
  console.log(`✅ Success Rate: ${successRate.toFixed(1)}%`);

  return {
    averageDuration,
    minDuration,
    maxDuration,
    successRate,
    results,
  };
}

/**
 * Validate landmark data structure
 */
export function validateLandmarks(landmarks: PoseLandmarks): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check required landmarks
  const requiredLandmarks = [
    "leftEye",
    "rightEye",
    "leftShoulder",
    "rightShoulder",
  ];

  for (const landmarkName of requiredLandmarks) {
    const landmark = landmarks[landmarkName as keyof PoseLandmarks];
    if (!landmark) {
      issues.push(`Missing required landmark: ${landmarkName}`);
      continue;
    }

    if (typeof landmark.x !== "number" || typeof landmark.y !== "number") {
      issues.push(
        `Invalid coordinates for ${landmarkName}: x=${landmark.x}, y=${landmark.y}`
      );
      continue;
    }

    if (isNaN(landmark.x) || isNaN(landmark.y)) {
      issues.push(
        `NaN coordinates for ${landmarkName}: x=${landmark.x}, y=${landmark.y}`
      );
      continue;
    }

    if (landmark.x < 0 || landmark.y < 0) {
      issues.push(
        `Negative coordinates for ${landmarkName}: x=${landmark.x}, y=${landmark.y}`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
