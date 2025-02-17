ALTER TABLE `exercises` ADD `primary_muscle` text NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `secondary_muscle` text NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `muscle_group`;