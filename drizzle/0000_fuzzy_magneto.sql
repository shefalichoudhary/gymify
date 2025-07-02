CREATE TABLE `exercise_muscles` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	`role` text NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscles_targeted`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `muscles_targeted` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
