PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`duration` integer NOT NULL,
	`volume` integer NOT NULL,
	`sets` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "routine_id", "date", "title", "duration", "volume", "sets") SELECT "id", "routine_id", "date", "title", "duration", "volume", "sets" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;