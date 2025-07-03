import { detectPose as nativeDetectPose } from "@/backtrack-pose";

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
export async function detectPose(uri: string): Promise<PoseLandmarks | null> {
  return nativeDetectPose(uri);
}
