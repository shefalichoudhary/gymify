// types/workout.ts
export type WorkoutSet = {
  lbs: number;
  reps: number;
  minReps?: number;
  maxReps?: number;
  isRangeReps?: boolean;
  previousLbs?: number;
  previousReps?: number;
  previousMinReps?: number;
  previousMaxReps?: number;
  isCompleted?: boolean;
};
