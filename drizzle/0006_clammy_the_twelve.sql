PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routine_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`lbs` integer NOT NULL,
	`reps` integer DEFAULT 0,
	`min_reps` integer DEFAULT 0,
	`max_reps` integer DEFAULT 0,
	`rest_timer` integer DEFAULT 0,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_routine_sets`("id", "routine_id", "lbs", "reps", "min_reps", "max_reps", "rest_timer") SELECT "id", "routine_id", "lbs", "reps", "min_reps", "max_reps", "rest_timer" FROM `routine_sets`;--> statement-breakpoint
DROP TABLE `routine_sets`;--> statement-breakpoint
ALTER TABLE `__new_routine_sets` RENAME TO `routine_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;