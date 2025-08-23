const seedExercises = [
  {
    exercise_name: "Bench Press",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Pectoralis Major", role: "Primary" },
      { name: "Triceps Brachii", role: "Secondary" },
      { name: "Anterior Deltoid", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Incline Bench Press",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Anterior Deltoid", role: "Secondary" },
      { name: "Triceps Brachii", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Dumbbell Bench Press",
    equipment: "Dumbbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Pectoralis Major", role: "Primary" },
      { name: "Triceps Brachii", role: "Secondary" },
      { name: "Anterior Deltoid", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Barbell Squat",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Quadriceps", role: "Primary" },
      { name: "Gluteus Maximus", role: "Secondary" },
      { name: "Hamstrings", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Leg Press",
    equipment: "Machine",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Quadriceps", role: "Primary" },
      { name: "Gluteus Maximus", role: "Secondary" },
      { name: "Hamstrings", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Deadlift",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Gluteus Maximus", role: "Primary" },
      { name: "Hamstrings", role: "Secondary" },
      { name: "Erector Spinae", role: "Secondary" },
      { name: "Trapezius", role: "Other" }
    ]
  },
  {
    exercise_name: "Romanian Deadlift",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Hamstrings", role: "Primary" },
      { name: "Gluteus Maximus", role: "Secondary" },
      { name: "Erector Spinae", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Overhead Press",
    equipment: "Barbell",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Deltoids", role: "Primary" },
      { name: "Triceps Brachii", role: "Secondary" },
      { name: "Trapezius", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Lateral Raise",
    equipment: "Dumbbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Lateral Deltoid", role: "Primary" },
      { name: "Supraspinatus", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Front Raise",
    equipment: "Dumbbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Anterior Deltoid", role: "Primary" },
      { name: "Serratus Anterior", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Rear Delt Fly",
    equipment: "Dumbbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Posterior Deltoid", role: "Primary" },
      { name: "Rhomboids", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Pull-up",
    equipment: "Bodyweight",
    type: "Compound",
    exercise_type: "Bodyweight",
    muscles: [
      { name: "Latissimus Dorsi", role: "Primary" },
      { name: "Biceps Brachii", role: "Secondary" },
      { name: "Rhomboids", role: "Other" }
    ]
  },
  {
    exercise_name: "Assisted Pull-up",
    equipment: "Machine",
    type: "Compound",
    exercise_type: "Assisted Bodyweight",
    muscles: [
      { name: "Latissimus Dorsi", role: "Primary" },
      { name: "Biceps Brachii", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Lat Pulldown",
    equipment: "Machine",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Latissimus Dorsi", role: "Primary" },
      { name: "Biceps Brachii", role: "Secondary" },
      { name: "Teres Major", role: "Other" }
    ]
  },
  {
    exercise_name: "Seated Row",
    equipment: "Machine",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Rhomboids", role: "Primary" },
      { name: "Latissimus Dorsi", role: "Secondary" },
      { name: "Biceps Brachii", role: "Other" }
    ]
  },
  {
    exercise_name: "Plank",
    equipment: "Bodyweight",
    type: "Isolation",
    exercise_type: "Duration",
    muscles: [
      { name: "Rectus Abdominis", role: "Primary" },
      { name: "Transverse Abdominis", role: "Secondary" },
      { name: "Obliques", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Dips",
    equipment: "Bodyweight",
    type: "Compound",
    exercise_type: "Bodyweight",
    muscles: [
      { name: "Triceps Brachii", role: "Primary" },
      { name: "Pectoralis Major", role: "Secondary" },
      { name: "Anterior Deltoid", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Assisted Dips",
    equipment: "Machine",
    type: "Compound",
    exercise_type: "Assisted Bodyweight",
    muscles: [
      { name: "Triceps Brachii", role: "Primary" },
      { name: "Pectoralis Major", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Leg Extension",
    equipment: "Machine",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Quadriceps", role: "Primary" }
    ]
  },
  {
    exercise_name: "Leg Curl",
    equipment: "Machine",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Hamstrings", role: "Primary" }
    ]
  },
  {
    exercise_name: "Calf Raise",
    equipment: "Machine",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Gastrocnemius", role: "Primary" },
      { name: "Soleus", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Face Pull",
    equipment: "Cable",
    type: "Compound",
    exercise_type: "Weighted",
    muscles: [
      { name: "Posterior Deltoid", role: "Primary" },
      { name: "Trapezius", role: "Secondary" },
      { name: "Rhomboids", role: "Secondary" }
    ]
  },

  {
    exercise_name: "Triceps Pushdown",
    equipment: "Cable",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Triceps Brachii", role: "Primary" }
    ]
  },
  {
    exercise_name: "Skullcrusher",
    equipment: "Barbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Triceps Brachii", role: "Primary" }
    ]
  },
  {
    exercise_name: "Hammer Curl",
    equipment: "Dumbbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Brachialis", role: "Primary" },
      { name: "Biceps Brachii", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Barbell Curl",
    equipment: "Barbell",
    type: "Isolation",
    exercise_type: "Weighted",
    muscles: [
      { name: "Biceps Brachii", role: "Primary" },
      { name: "Brachialis", role: "Secondary" }
    ]
  },
    {
    exercise_name: "Child's Pose",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Erector Spinae", role: "Primary" },
      { name: "Latissimus Dorsi", role: "Secondary" },
      { name: "Gluteus Maximus", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Downward Dog",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Hamstrings", role: "Primary" },
      { name: "Gastrocnemius", role: "Primary" },
      { name: "Shoulders", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Cobra Pose",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Erector Spinae", role: "Primary" },
      { name: "Abdominals", role: "Secondary" },
      { name: "Chest", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Standing Forward Bend",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Hamstrings", role: "Primary" },
      { name: "Calves", role: "Secondary" },
      { name: "Lower Back", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Seated Spinal Twist",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Obliques", role: "Primary" },
      { name: "Erector Spinae", role: "Secondary" },
      { name: "Gluteus Maximus", role: "Secondary" }
    ]
  },
  {
    exercise_name: "Cat-Cow Stretch",
    equipment: "Bodyweight",
    type: "Stretching",
    exercise_type: "Yoga",
    muscles: [
      { name: "Erector Spinae", role: "Primary" },
      { name: "Abdominals", role: "Secondary" },
      { name: "Neck", role: "Secondary" }
    ]
  }
];

export default seedExercises;
