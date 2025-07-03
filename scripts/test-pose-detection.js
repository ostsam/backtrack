#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Pose Detection Testing Script");
console.log("================================\n");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, "cyan");
  try {
    const result = execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    log(`✅ ${description} completed successfully`, "green");
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, "red");
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "setup":
      setup();
      break;
    case "build":
      build();
      break;
    case "test":
      test();
      break;
    case "run":
      run();
      break;
    case "full":
      fullTest();
      break;
    default:
      showHelp();
  }
}

function setup() {
  log("Setting up pose detection testing environment...", "blue");

  // Check if we're in the right directory
  if (!checkFileExists("package.json")) {
    log(
      "❌ Error: package.json not found. Please run this script from the Backtrack directory.",
      "red"
    );
    process.exit(1);
  }

  // Check if backtrack-pose module exists
  if (!checkFileExists("../backtrack-pose")) {
    log(
      "❌ Error: backtrack-pose module not found. Please ensure it exists in the parent directory.",
      "red"
    );
    process.exit(1);
  }

  log("✅ Environment check passed", "green");

  // Install dependencies
  runCommand("npm install", "Installing dependencies");

  // Install the native module
  runCommand(
    "npm install ../backtrack-pose",
    "Installing backtrack-pose module"
  );

  log("\n🎉 Setup complete! You can now run tests.", "green");
  log("Next steps:", "yellow");
  log("  npm run test-pose:build  - Build the native module", "cyan");
  log("  npm run test-pose:test   - Run unit tests", "cyan");
  log("  npm run test-pose:run    - Start the app for manual testing", "cyan");
}

function build() {
  log("Building pose detection module...", "blue");

  // Build the native module
  const modulePath = path.resolve("../backtrack-pose");
  if (!checkFileExists(modulePath)) {
    log("❌ Error: backtrack-pose module not found", "red");
    process.exit(1);
  }

  process.chdir(modulePath);
  runCommand("npm run build", "Building backtrack-pose module");

  // Return to main directory
  process.chdir(path.resolve("../../Backtrack"));

  // Reinstall the module
  runCommand("npm install ../backtrack-pose", "Reinstalling updated module");

  log("\n🎉 Build complete!", "green");
}

function test() {
  log("Running pose detection tests...", "blue");

  // Check if Jest is available
  if (!checkFileExists("node_modules/.bin/jest")) {
    log("❌ Error: Jest not found. Please run setup first.", "red");
    process.exit(1);
  }

  // Run unit tests
  runCommand(
    "npx jest utils/__tests__/detectPose.test.ts",
    "Running unit tests"
  );

  log("\n🎉 Tests complete!", "green");
}

function run() {
  log("Starting app for manual testing...", "blue");

  // Check if Expo CLI is available
  if (!checkFileExists("node_modules/.bin/expo")) {
    log("❌ Error: Expo CLI not found. Please run setup first.", "red");
    process.exit(1);
  }

  log("📱 Starting Expo development server...", "cyan");
  log("💡 Once the app loads:", "yellow");
  log("  1. Navigate to the main monitor screen", "cyan");
  log('  2. Tap "Test Pose Detection" (dev mode only)', "cyan");
  log("  3. Grant camera permissions", "cyan");
  log("  4. Use the test controls to verify functionality", "cyan");

  runCommand("npx expo start", "Starting Expo development server");
}

function fullTest() {
  log("Running full test suite...", "blue");

  const steps = [
    () => runCommand("npm install", "Installing dependencies"),
    () =>
      runCommand("npm install ../backtrack-pose", "Installing native module"),
    () => {
      process.chdir("../backtrack-pose");
      const result = runCommand("npm run build", "Building native module");
      process.chdir("../Backtrack");
      return result;
    },
    () =>
      runCommand(
        "npx jest utils/__tests__/detectPose.test.ts",
        "Running unit tests"
      ),
  ];

  let allPassed = true;
  for (const step of steps) {
    if (!step()) {
      allPassed = false;
      break;
    }
  }

  if (allPassed) {
    log("\n🎉 Full test suite completed successfully!", "green");
    log('Next: Run "npm run test-pose:run" to start manual testing', "cyan");
  } else {
    log("\n❌ Full test suite failed. Please check the errors above.", "red");
    process.exit(1);
  }
}

function showHelp() {
  log("Pose Detection Testing Script", "bright");
  log("=============================\n");

  log("Available commands:", "yellow");
  log("  setup  - Set up the testing environment", "cyan");
  log("  build  - Build the native module", "cyan");
  log("  test   - Run unit tests", "cyan");
  log("  run    - Start the app for manual testing", "cyan");
  log("  full   - Run complete test suite", "cyan");

  log("\nUsage:", "yellow");
  log("  node scripts/test-pose-detection.js <command>", "cyan");

  log("\nExamples:", "yellow");
  log("  node scripts/test-pose-detection.js setup", "cyan");
  log("  node scripts/test-pose-detection.js full", "cyan");
  log("  node scripts/test-pose-detection.js run", "cyan");

  log("\nTesting Flow:", "yellow");
  log("1. setup  - Initial environment setup", "cyan");
  log("2. build  - Build native module (after changes)", "cyan");
  log("3. test   - Run automated tests", "cyan");
  log("4. run    - Manual testing with real camera", "cyan");

  log("\nFor detailed testing instructions, see: docs/TestingGuide.md", "blue");
}

if (require.main === module) {
  main();
}

module.exports = { setup, build, test, run, fullTest };
