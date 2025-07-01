import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { createAudioPlayer, AudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { usePose } from "@/hooks/usePose";

// How often to trigger haptics while slouching (ms)
const VIBRATION_INTERVAL_MS = 5000;

export default function AlertManager() {
  const { slouching } = usePose();
  const playerRef = useRef<AudioPlayer | null>(null);
  const vibrIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load & configure audio once
  useEffect(() => {
    (async () => {
      await setAudioModeAsync({ playsInSilentMode: true });
      // Create audio player with looping alert sound
      const player = createAudioPlayer(require("@/assets/sounds/alert.mp3"));
      player.loop = true;
      player.volume = 1;
      playerRef.current = player;
    })();

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
      }
    };
  }, []);

  // React to slouching state changes
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (slouching) {
      // Start audio if not playing
      if (!player.playing) {
        player.play();
      }
      // Start vibration loop (Android only for now)
      if (Platform.OS === "android" && vibrIntervalRef.current === null) {
        vibrIntervalRef.current = setInterval(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, VIBRATION_INTERVAL_MS);
      }
    } else {
      // Stop audio
      if (player.playing) {
        player.pause();
      }
      // Stop vibration loop
      if (vibrIntervalRef.current) {
        clearInterval(vibrIntervalRef.current);
        vibrIntervalRef.current = null;
      }
    }
  }, [slouching]);

  // This component renders nothing
  return null;
}
