export const getExerciseTypeFlags = (type: string | null) => ({
  isDuration: type === "Duration" || type === "Yoga",
  isWeighted: type === "Weighted" || type === "Assisted Bodyweight",
  isBodyweight: type === "Bodyweight",
});
