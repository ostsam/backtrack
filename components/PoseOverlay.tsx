import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import { useBaseline } from "@/context/BaselineContext";

/**
 * Centralised style so future tweaks (colour, strokeWidth, etc.) are easy.
 * Move these constants around as desired – having them in one place lets us
 * expose theme toggles down the road without hunting through drawing code.
 */
const STROKE_COLOR = "#FFFFFF"; // default white, tweakable later
const STROKE_WIDTH = 3;
const POINT_RADIUS = 4;

export default function PoseOverlay() {
  const { lastPose, lastFrameSize } = useBaseline();
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  const lines = useMemo(() => {
    if (!size || !lastPose || !lastFrameSize) return null;

    const { width, height } = size;
    const { width: imgW, height: imgH } = lastFrameSize;

    // Scale using the original image resolution so overlay matches preview.
    const scaleX = width / imgW;
    const scaleY = height / imgH;
    const sx = (x: number) => x * scaleX;
    const sy = (y: number) => y * scaleY;

    const pts = lastPose as any;

    const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];

    if (pts.leftShoulder && pts.rightShoulder) {
      segments.push({
        x1: sx(pts.leftShoulder.x),
        y1: sy(pts.leftShoulder.y),
        x2: sx(pts.rightShoulder.x),
        y2: sy(pts.rightShoulder.y),
      });
    }
    if (pts.leftEye && pts.leftShoulder) {
      segments.push({
        x1: sx(pts.leftEye.x),
        y1: sy(pts.leftEye.y),
        x2: sx(pts.leftShoulder.x),
        y2: sy(pts.leftShoulder.y),
      });
    }
    if (pts.rightEye && pts.rightShoulder) {
      segments.push({
        x1: sx(pts.rightEye.x),
        y1: sy(pts.rightEye.y),
        x2: sx(pts.rightShoulder.x),
        y2: sy(pts.rightShoulder.y),
      });
    }
    return { segments, sx, sy };
  }, [lastPose, size, lastFrameSize]);

  if (!lines) {
    return <Svg style={styles.overlay} onLayout={onLayout} />;
  }

  const { segments, sx, sy } = lines;

  return (
    <Svg style={styles.overlay} onLayout={onLayout}>
      {segments.map((s, idx) => (
        <Line
          key={idx}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
      ))}
      {/* Draw points */}
      {lastPose?.leftEye && (
        <Circle
          cx={sx(lastPose.leftEye.x)}
          cy={sy(lastPose.leftEye.y)}
          r={POINT_RADIUS}
          fill={STROKE_COLOR}
        />
      )}
      {lastPose?.rightEye && (
        <Circle
          cx={sx(lastPose.rightEye.x)}
          cy={sy(lastPose.rightEye.y)}
          r={POINT_RADIUS}
          fill={STROKE_COLOR}
        />
      )}
      {lastPose?.leftShoulder && (
        <Circle
          cx={sx(lastPose.leftShoulder.x)}
          cy={sy(lastPose.leftShoulder.y)}
          r={POINT_RADIUS}
          fill={STROKE_COLOR}
        />
      )}
      {lastPose?.rightShoulder && (
        <Circle
          cx={sx(lastPose.rightShoulder.x)}
          cy={sy(lastPose.rightShoulder.y)}
          r={POINT_RADIUS}
          fill={STROKE_COLOR}
        />
      )}
      {lastPose?.nose && (
        <Circle
          cx={sx(lastPose.nose.x)}
          cy={sy(lastPose.nose.y)}
          r={POINT_RADIUS}
          fill={STROKE_COLOR}
        />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
