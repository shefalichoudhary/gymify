// types/workout.ts
export type WorkoutSet = {
  weight?: number;
  reps?: number;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;
  previousWeight?: number;
  previousReps?: number;
  previousMinReps?: number;
  previousMaxReps?: number;
  isCompleted?: boolean;
};
