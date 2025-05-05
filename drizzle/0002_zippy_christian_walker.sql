PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`equipment` text NOT NULL,
	`primary_muscle` text DEFAULT 'Unknown' NOT NULL,
	`secondary_muscle` text DEFAULT 'Unknown' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "category", "equipment", "primary_muscle", "secondary_muscle") SELECT "id", "name", "category", "equipment", "primary_muscle", "secondary_muscle" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_name_unique` ON `exercises` (`name`);