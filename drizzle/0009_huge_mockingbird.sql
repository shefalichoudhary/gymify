PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine_exercises`("id", "routine_id", "exercise_id", "notes") SELECT "id", "routine_id", "exercise_id", "notes" FROM `routine_exercises`;--> statement-breakpoint
DROP TABLE `routine_exercises`;--> statement-breakpoint
ALTER TABLE `__new_routine_exercises` RENAME TO `routine_exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;