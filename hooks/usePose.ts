import { useMemo } from "react";
import { useBaseline } from "@/context/BaselineContext";
import { angleBetween } from "@/utils/geometry";
import { POSTURE_THRESHOLD_DEGREES } from "@/constants/Posture";

export function usePose() {
  const { lastPose, baseline } = useBaseline();

  const { angle, slouching } = useMemo(() => {
    if (!baseline || !lastPose) return { angle: null, slouching: false };

    const leftLiveVec =
      lastPose.leftEye && lastPose.leftShoulder
        ? {
            x: lastPose.leftShoulder.x - lastPose.leftEye.x,
            y: lastPose.leftShoulder.y - lastPose.leftEye.y,
          }
        : null;
    const rightLiveVec =
      lastPose.rightEye && lastPose.rightShoulder
        ? {
            x: lastPose.rightShoulder.x - lastPose.rightEye.x,
            y: lastPose.rightShoulder.y - lastPose.rightEye.y,
          }
        : null;

    const angles: number[] = [];
    if (baseline.left?.vec && leftLiveVec)
      angles.push(angleBetween(baseline.left.vec, leftLiveVec));
    if (baseline.right?.vec && rightLiveVec)
      angles.push(angleBetween(baseline.right.vec, rightLiveVec));

    if (angles.length === 0) return { angle: null, slouching: false };

    const avg = angles.reduce((sum, a) => sum + a, 0) / angles.length;
    const slouching = avg >= POSTURE_THRESHOLD_DEGREES;
    return { angle: avg, slouching };
  }, [baseline, lastPose]);

  return { angle, slouching };
}
