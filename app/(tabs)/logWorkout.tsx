import React, { useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack } from "@gluestack-ui/themed";

export default function LogWorkoutScreen() {
  const [duration, setDuration] = useState(0); // in seconds
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const [sets, setSets] = useState([
    { id: "1", weight: 3, reps: 3, completed: true },
    { id: "2", weight: 10, reps: 5, completed: true },
  ]);

  const [totalVolume, setTotalVolume] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  // Start timer on workout start
useEffect(() => {
  let interval: ReturnType<typeof setInterval> | null = null;

  if (isWorkoutActive) {
    interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isWorkoutActive]);


  // Calculate total volume and sets
  useEffect(() => {
    const completedSets = sets.filter(set => set.completed);
    const volume = completedSets.reduce(
      (sum, set) => sum + set.weight * set.reps,
      0
    );

    setTotalVolume(volume);
    setTotalSets(completedSets.length);
  }, [sets]);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
  };

  return (
    <VStack p="$4" space="md">
      <HStack justifyContent="space-between">
        <Text>Duration: {duration}s</Text>
        <Text>Volume: {totalVolume} kg</Text>
        <Text>Sets: {totalSets}</Text>
      </HStack>

      {/* Replace this with your own sets rendering */}
      {sets.map((set, index) => (
        <HStack
          key={set.id}
          justifyContent="space-between"
          bgColor={set.completed ? "$green200" : "$gray100"}
          p="$2"
          rounded="$md"
        >
          <Text>Set {index + 1}</Text>
          <Text>{set.weight}kg x {set.reps}</Text>
          <Button
            size="sm"
            onPress={() => {
              const updated = [...sets];
              updated[index].completed = !updated[index].completed;
              setSets(updated);
            }}
          >
            {set.completed ? "✓" : "✗"}
          </Button>
        </HStack>
      ))}

      <Button onPress={handleStartWorkout}>Start</Button>
    </VStack>
  );
}
