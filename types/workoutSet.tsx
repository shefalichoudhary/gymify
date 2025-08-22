export type WorkoutSet = {
  weight?: number;
  reps?: number | null;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;

  // Previous values for prefill
  previousWeight?: number;
  previousReps?: number;
  previousMinReps?: number;
  previousMaxReps?: number;
  previousUnit?: "kg" | "lbs";
  previousRepsType?: "reps" | "rep range";
  previousDuration?: number;

  // Set metadata
  isCompleted?: boolean;
  setType?: "W" | "Normal" | "D" | "F" | string;
  unit?: "kg" | "lbs";
  repsType?: "reps" | "rep range";
    duration?: number;
};
