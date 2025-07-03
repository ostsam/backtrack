// Reexport the native module. On web, it will be resolved to BacktrackPoseModule.web.ts
// and on native platforms to BacktrackPoseModule.ts
export { default } from './src/BacktrackPoseModule';
export { default as BacktrackPoseView } from './src/BacktrackPoseView';
export * from  './src/BacktrackPose.types';
