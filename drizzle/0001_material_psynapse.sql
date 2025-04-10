CREATE TABLE `team_members` (
	`user_id` text NOT NULL,
	`team_id` text NOT NULL,
	`role` text DEFAULT 'member',
	`created_at` text DEFAULT '2025-04-10T05:18:57.317Z',
	`updated_at` text DEFAULT '2025-04-10T05:18:57.317Z',
	PRIMARY KEY(`user_id`, `team_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT '2025-04-10T05:18:57.317Z',
	`updated_at` text DEFAULT '2025-04-10T05:18:57.317Z'
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_passwords` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` text DEFAULT '2025-04-10T05:18:57.317Z',
	`updated_at` text DEFAULT '2025-04-10T05:18:57.317Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_passwords`("id", "user_id", "hash", "created_at", "updated_at") SELECT "id", "user_id", "hash", "created_at", "updated_at" FROM `passwords`;--> statement-breakpoint
DROP TABLE `passwords`;--> statement-breakpoint
ALTER TABLE `__new_passwords` RENAME TO `passwords`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT '2025-04-10T05:18:57.316Z',
	`updated_at` text DEFAULT '2025-04-10T05:18:57.316Z'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "created_at", "updated_at") SELECT "id", "name", "email", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);