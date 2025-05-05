CREATE TABLE `exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_exercise_id` text NOT NULL,
	`type` text NOT NULL,
	`weight` integer NOT NULL,
	`unit` text NOT NULL,
	`reps` integer,
	`reps_min` integer,
	`reps_max` integer,
	`rest_timer ` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`name` text NOT NULL,
	`rountine_note` text NOT NULL,
	`rest_timer ` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT '2025-04-28T19:38:31.191Z'
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`equipment` text NOT NULL,
	`primary_muscle` text DEFAULT '' NOT NULL,
	`secondary_muscle` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "name", "category", "equipment", "primary_muscle", "secondary_muscle") SELECT "id", "name", "category", "equipment", "primary_muscle", "secondary_muscle" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_name_unique` ON `exercises` (`name`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password") SELECT "id", "name", "email", "password" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);