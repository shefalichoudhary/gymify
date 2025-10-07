PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'Guest' NOT NULL,
	`email` text DEFAULT 'guest@example.com' NOT NULL,
	`password` text DEFAULT '' NOT NULL,
	`google` integer DEFAULT 0,
	`photo` text DEFAULT '',
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "google", "photo", "created_at") SELECT "id", "name", "email", "password", "google", "photo", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;