import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { Box, Pressable } from "@gluestack-ui/themed";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Vibration } from "react-native";

export type DurationTimerRef = {
  stopTimer: () => void;
};

type DurationTimerProps = {
  duration: number;
  onChange: (value: number) => void;
};

const DurationTimer = forwardRef<DurationTimerRef, DurationTimerProps>(
  ({ duration, onChange }, ref) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const [elapsed, setElapsed] = useState(duration);
    useImperativeHandle(ref, () => ({
      stopTimer: async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimerRunning(false);

        // Play stop sound
        try {
          const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/beep-end.mp3"));
          await sound.playAsync();
        } catch (e) {
          console.log("Error playing stop sound:", e);
        }

        Vibration.vibrate([0, 200], false);
      },
    }));

    const startTimer = async () => {
      if (!timerRunning) {
        setTimerRunning(true);
        try {
          const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/beep.mp3"));
          await sound.playAsync();
        } catch {}
        Vibration.vibrate([0, 200], false);

        intervalRef.current = setInterval(() => {
          setElapsed((prev) => {
            const newVal = prev + 1;
            onChange(newVal); // notify parent
            return newVal;
          });
        }, 1000);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimerRunning(false);
        try {
          const { sound } = await Audio.Sound.createAsync(require("@/assets/sounds/beep-end.mp3"));
          await sound.playAsync();
        } catch {}

        Vibration.vibrate([0, 200], false);
      }
    };

    useEffect(() => {
      setElapsed(duration);
    }, [duration]);

    return (
      <Box flexDirection="row" alignItems="center">
        <Pressable onPress={startTimer}>
          {timerRunning ? (
            <AntDesign name="pausecircle" size={28} color="#3b82f6" />
          ) : (
            <Ionicons name="caret-forward-circle-outline" size={28} color="#3b82f6" />
          )}
        </Pressable>
      </Box>
    );
  }
);

export default DurationTimer;
