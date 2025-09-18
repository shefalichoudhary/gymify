// components/DurationTimer.tsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { Box, Pressable } from "@gluestack-ui/themed";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Vibration } from "react-native";

export type DurationTimerRef = {
  stopTimer: () => void;
};

type DurationTimerProps = {
  duration: number; // target duration in seconds
  onChange: (value: number) => void; // update parent with elapsed seconds
};

const DurationTimer = forwardRef<DurationTimerRef, DurationTimerProps>(
  ({ duration, onChange }, ref) => {
    const [time, setTime] = useState(duration || 0);
    const [timerRunning, setTimerRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const playSound = async (file: any) => {
      try {
        const { sound } = await Audio.Sound.createAsync(file);
        await sound.playAsync();
      } catch (e) {
        console.log("Error playing sound:", e);
      }
    };

    const startTimer = async () => {
      if (!timerRunning) {
        setTimerRunning(true);
        playSound(require("@/assets/sounds/beep.mp3"));
        Vibration.vibrate([0, 200], false);

       intervalRef.current = setInterval(() => {
  setTime((prev) => {
    const newVal = prev + 1;
    onChange(newVal);
    return newVal;
  });
}, 1000);
      } else {
        stopTimer();
      }
    };

    const stopTimer = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTimerRunning(false);

      setTime(duration || 0); // reset for restart
      playSound(require("@/assets/sounds/beep-end.mp3"));
      Vibration.vibrate([0, 200], false);
    };

   

    return (
      <Box flexDirection="row" alignItems="center">
        <Pressable onPress={startTimer}>
          {timerRunning ? (
            <AntDesign name="pausecircle" size={28} color="#3b82f6" />
          ) : (
            <Ionicons
              name="caret-forward-circle-outline"
              size={28}
              color="#3b82f6"
            />
          )}
        </Pressable>
      </Box>
    );
  }
);

export default DurationTimer;
