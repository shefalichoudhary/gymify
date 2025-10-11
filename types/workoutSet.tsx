export type WorkoutSet = {
  weight?: number | null;
  reps?: number | null;
  minReps?: number | null;
  maxReps?: number | null;
  duration?: number | null;
  isRangeReps?: boolean;
  previousWeight?: number | null;
  previousReps?: number | null;
  previousMinReps?: number | null;
  previousMaxReps?: number | null;
  previousUnit?: "kg" | "lbs";
  previousRepsType?: "reps" | "rep range";
  isCompleted?: boolean;
  setType?: "W" | "Normal" | "D" | "F" | string;
  unit?: "kg" | "lbs";
  repsType?: "reps" | "rep range";
};
