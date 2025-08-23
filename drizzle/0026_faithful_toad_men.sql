PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`weight` integer NOT NULL,
	`min_reps` integer,
	`max_reps` integer,
	`previous_weight` integer,
	`previous_reps` integer,
	`previous_min_reps` integer,
	`previous_max_reps` integer,
	`previous_unit` text,
	`previous_reps_type` text,
	`reps` integer DEFAULT 0,
	`duration` integer DEFAULT 0,
	`set_type` text DEFAULT 'Normal' NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_sets`("id", "workout_id", "exercise_id", "weight", "min_reps", "max_reps", "previous_weight", "previous_reps", "previous_min_reps", "previous_max_reps", "previous_unit", "previous_reps_type", "reps", "duration", "set_type") SELECT "id", "workout_id", "exercise_id", "weight", "min_reps", "max_reps", "previous_weight", "previous_reps", "previous_min_reps", "previous_max_reps", "previous_unit", "previous_reps_type", "reps", "duration", "set_type" FROM `workout_sets`;--> statement-breakpoint
DROP TABLE `workout_sets`;--> statement-breakpoint
ALTER TABLE `__new_workout_sets` RENAME TO `workout_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;