CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`equipment` text NOT NULL,
	`secondary_muscle` text DEFAULT 'Unknown' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_name_unique` ON `exercises` (`name`);