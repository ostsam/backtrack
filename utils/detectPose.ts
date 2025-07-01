export interface Point {
  x: number;
  y: number;
}

export interface PoseLandmarks {
  leftEye: Point;
  rightEye: Point;
  leftShoulder: Point;
  rightShoulder: Point;
}

// Simple deterministic stub that simulates slight posture changes over time.
let frame = 0;

export async function detectPose(_base64: string): Promise<PoseLandmarks> {
  // Simulate shoulder dropping to mimic slouching.
  const delta = Math.sin(frame / 5) * 15; // ±15 px over time
  frame++;

  return {
    leftEye: { x: 100, y: 100 },
    rightEye: { x: 200, y: 100 },
    leftShoulder: { x: 100, y: 200 + delta },
    rightShoulder: { x: 200, y: 200 + delta },
  };
}
