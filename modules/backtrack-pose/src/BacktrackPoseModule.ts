import { NativeModule, requireNativeModule } from 'expo';

import { BacktrackPoseModuleEvents } from './BacktrackPose.types';

declare class BacktrackPoseModule extends NativeModule<BacktrackPoseModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BacktrackPoseModule>('BacktrackPose');
