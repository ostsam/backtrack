import React, { createContext, useContext, useState, useCallback } from "react";

// Types for pose landmarks we care about
export interface Point {
  x: number;
  y: number;
}

export interface EyeShoulderVectors {
  left: { base: Point; vec: { x: number; y: number } } | null;
  right: { base: Point; vec: { x: number; y: number } } | null;
}

export interface PoseLandmarks {
  leftShoulder?: Point;
  rightShoulder?: Point;
  leftEye?: Point;
  rightEye?: Point;
  nose?: Point;
}

interface BaselineContextValue {
  lastPose: PoseLandmarks | null;
  setLastPose: (pose: PoseLandmarks) => void;
  baseline: EyeShoulderVectors | null;
  setBaseline: () => void;
}

const BaselineContext = createContext<BaselineContextValue | undefined>(
  undefined
);

export const BaselineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastPose, setLastPose] = useState<PoseLandmarks | null>(null);
  const [baseline, setBaselineState] = useState<EyeShoulderVectors | null>(
    null
  );

  const setBaseline = useCallback(() => {
    if (!lastPose) return;
    const left =
      lastPose.leftEye && lastPose.leftShoulder
        ? {
            base: lastPose.leftEye,
            vec: {
              x: lastPose.leftShoulder.x - lastPose.leftEye.x,
              y: lastPose.leftShoulder.y - lastPose.leftEye.y,
            },
          }
        : null;
    const right =
      lastPose.rightEye && lastPose.rightShoulder
        ? {
            base: lastPose.rightEye,
            vec: {
              x: lastPose.rightShoulder.x - lastPose.rightEye.x,
              y: lastPose.rightShoulder.y - lastPose.rightEye.y,
            },
          }
        : null;
    setBaselineState({ left, right });
  }, [lastPose]);

  const value: BaselineContextValue = {
    lastPose,
    setLastPose,
    baseline,
    setBaseline,
  };

  return (
    <BaselineContext.Provider value={value}>
      {children}
    </BaselineContext.Provider>
  );
};

export function useBaseline() {
  const ctx = useContext(BaselineContext);
  if (!ctx) throw new Error("useBaseline must be used within BaselineProvider");
  return ctx;
}
