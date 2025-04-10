CREATE TABLE `passwords` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` text DEFAULT '2025-04-10T04:12:52.088Z',
	`updated_at` text DEFAULT '2025-04-10T04:12:52.088Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT '2025-04-10T04:12:52.087Z',
	`updated_at` text DEFAULT '2025-04-10T04:12:52.088Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);