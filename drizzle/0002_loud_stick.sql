PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_name` text NOT NULL,
	`exercise_type` text DEFAULT 'Weighted' NOT NULL,
	`equipment` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "exercise_name", "exercise_type", "equipment", "type") SELECT "id", "exercise_name", "exercise_type", "equipment", "type" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;