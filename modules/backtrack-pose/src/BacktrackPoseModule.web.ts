import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './BacktrackPose.types';

type BacktrackPoseModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class BacktrackPoseModule extends NativeModule<BacktrackPoseModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(BacktrackPoseModule, 'BacktrackPoseModule');
