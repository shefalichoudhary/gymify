ALTER TABLE `routine_sets` RENAME COLUMN "lbs" TO "weight";--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`weight` integer NOT NULL,
	`reps` integer,
	`min_reps` integer,
	`max_reps` integer,
	`is_range_reps` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `routine_exercises` ADD `unit` text DEFAULT 'kg' NOT NULL;