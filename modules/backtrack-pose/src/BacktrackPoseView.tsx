import { requireNativeView } from 'expo';
import * as React from 'react';

import { BacktrackPoseViewProps } from './BacktrackPose.types';

const NativeView: React.ComponentType<BacktrackPoseViewProps> =
  requireNativeView('BacktrackPose');

export default function BacktrackPoseView(props: BacktrackPoseViewProps) {
  return <NativeView {...props} />;
}
