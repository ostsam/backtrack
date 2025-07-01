import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import {
  createAudioPlayer,
  AudioPlayer,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { usePose } from "@/hooks/usePose";

// How often to trigger haptics while slouching (ms)
const VIBRATION_INTERVAL_MS = 5000;

export default function AlertManager() {
  const { slouching } = usePose();
  const playerRef = useRef<AudioPlayer | null>(null);
  const vibrIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayAtRef = useRef<number>(0);
  const slouchingRef = useRef(false);
  const durationRef = useRef<number>(1000); // fallback 1s

  // Load & configure audio once
  useEffect(() => {
    (async () => {
      // Ensure audio session is active and plays in silent mode
      await setIsAudioActiveAsync(true);
      await setAudioModeAsync({ playsInSilentMode: true });
      // Create audio player
      const player = createAudioPlayer(
        require("@/assets/sounds/alert.mp3"),
        100
      );
      player.loop = false;
      player.volume = 1;
      // Preload to measure duration
      try {
        player.play();
        setTimeout(() => {
          player.pause();
          if (player.duration && !isNaN(player.duration)) {
            durationRef.current = player.duration * 1000;
            console.log("AlertManager: Beep duration", durationRef.current);
          }
        }, 100);
      } catch (e) {
        console.warn("AlertManager: preload play failed", e);
      }
      playerRef.current = player;
    })();

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
      }
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  // React to slouching state changes
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // Clear loop timer when slouching flag changes
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }

    // Keep latest slouching state in ref for other callbacks
    slouchingRef.current = slouching;

    if (slouching) {
      // Start looping routine if not already
      const GAP_MS = durationRef.current + 1000; // 1-second gap

      const schedulePlay = (delay: number) => {
        loopTimeoutRef.current = setTimeout(() => {
          if (!slouchingRef.current || !playerRef.current) return;

          playerRef.current
            .seekTo(0)
            .then(() => {
              playerRef.current?.play();
              lastPlayAtRef.current = Date.now();
              // Schedule next loop automatically
              schedulePlay(GAP_MS);
            })
            .catch((e) => console.warn("AlertManager: play failed", e));
        }, delay);
      };

      // If nothing scheduled, compute remaining time until next allowed play
      if (!loopTimeoutRef.current) {
        const now = Date.now();
        const elapsed = now - lastPlayAtRef.current;
        const initialDelay = elapsed >= GAP_MS ? 0 : GAP_MS - elapsed;
        schedulePlay(initialDelay);
      }

      // Start vibration loop (Android only for now)
      if (Platform.OS === "android" && vibrIntervalRef.current === null) {
        vibrIntervalRef.current = setInterval(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, VIBRATION_INTERVAL_MS);
      }
    } else {
      // Stop scheduling further loops but let current sound finish
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
      // Stop vibration loop immediately
      if (vibrIntervalRef.current) {
        clearInterval(vibrIntervalRef.current);
        vibrIntervalRef.current = null;
      }
    }
  }, [slouching]);

  // This component renders nothing
  return null;
}
