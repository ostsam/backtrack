import { detectPose, PoseLandmarks } from "../detectPose";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the native module
vi.mock("backtrack-pose", () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockNativeDetectPose = require("backtrack-pose").default;

describe("detectPose", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return landmarks when native module succeeds", async () => {
    const mockLandmarks: PoseLandmarks = {
      leftEye: { x: 100, y: 100 },
      rightEye: { x: 200, y: 100 },
      leftShoulder: { x: 50, y: 250 },
      rightShoulder: { x: 250, y: 250 },
    };

    mockNativeDetectPose.mockResolvedValue(mockLandmarks);

    const result = await detectPose("file://test-image.jpg");

    expect(mockNativeDetectPose).toHaveBeenCalledWith("file://test-image.jpg");
    expect(result).toEqual(mockLandmarks);
  });

  it("should return null when native module returns null", async () => {
    mockNativeDetectPose.mockResolvedValue(null);

    const result = await detectPose("file://test-image.jpg");

    expect(result).toBeNull();
  });

  it("should throw error when native module throws", async () => {
    const error = new Error("Native module error");
    mockNativeDetectPose.mockRejectedValue(error);

    await expect(detectPose("file://test-image.jpg")).rejects.toThrow(
      "Native module error"
    );
  });

  it("should handle empty URI", async () => {
    mockNativeDetectPose.mockResolvedValue(null);

    const result = await detectPose("");

    expect(mockNativeDetectPose).toHaveBeenCalledWith("");
    expect(result).toBeNull();
  });

  it("should validate landmark structure", async () => {
    const validLandmarks: PoseLandmarks = {
      leftEye: { x: 100, y: 100 },
      rightEye: { x: 200, y: 100 },
      leftShoulder: { x: 50, y: 250 },
      rightShoulder: { x: 250, y: 250 },
    };

    mockNativeDetectPose.mockResolvedValue(validLandmarks);

    const result = await detectPose("file://test-image.jpg");

    expect(result).toHaveProperty("leftEye");
    expect(result).toHaveProperty("rightEye");
    expect(result).toHaveProperty("leftShoulder");
    expect(result).toHaveProperty("rightShoulder");

    expect(result?.leftEye).toHaveProperty("x");
    expect(result?.leftEye).toHaveProperty("y");
    expect(typeof result?.leftEye.x).toBe("number");
    expect(typeof result?.leftEye.y).toBe("number");
  });
});
