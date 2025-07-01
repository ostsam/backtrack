// Posture detection constants
// Values are defaults; user can override via Settings screen.

export const POSTURE_THRESHOLD_DEGREES = 12; // Δθ to trigger slouch alert
export const POSTURE_HYSTERESIS_DEGREES = 2; // degrees slouch must recover below threshold

export const HEAD_TILT_ROLL_DEGREES = 5; // head lateral tilt threshold

// Frame capture interval in milliseconds (default 2 seconds)
export const FRAME_CAPTURE_INTERVAL_MS = 2000;

// Android background fetch interval (default 5 minutes)
export const BACKGROUND_FETCH_INTERVAL_MIN = 5;
