ALTER TABLE `users` ADD `username` text DEFAULT 'Guest' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;