ALTER TABLE `workouts` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `workouts` ADD `title` text NOT NULL;