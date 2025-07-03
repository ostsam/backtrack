import * as React from 'react';

import { BacktrackPoseViewProps } from './BacktrackPose.types';

export default function BacktrackPoseView(props: BacktrackPoseViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
