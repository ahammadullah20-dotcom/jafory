CREATE TABLE `affiliateLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`market` enum('uae','bangladesh','global') NOT NULL,
	`merchantName` varchar(140) NOT NULL,
	`destinationUrl` text NOT NULL,
	`priceDisplay` varchar(80),
	`availabilityText` varchar(120),
	`isPrimary` int NOT NULL DEFAULT 1,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliateLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`nameEn` varchar(180) NOT NULL,
	`nameAr` varchar(180) NOT NULL,
	`nameBn` varchar(180) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`descriptionBn` text,
	`imageUrl` text,
	`accentColor` varchar(24) NOT NULL DEFAULT '#0F766E',
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `heroSlides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eyebrowEn` varchar(140) NOT NULL,
	`eyebrowAr` varchar(140) NOT NULL,
	`eyebrowBn` varchar(140) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleBn` varchar(255) NOT NULL,
	`bodyEn` text,
	`bodyAr` text,
	`bodyBn` text,
	`ctaLabelEn` varchar(100) NOT NULL,
	`ctaLabelAr` varchar(100) NOT NULL,
	`ctaLabelBn` varchar(100) NOT NULL,
	`ctaUrl` text NOT NULL,
	`imageUrl` text,
	`tone` varchar(32) NOT NULL DEFAULT 'teal',
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `heroSlides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productSpecifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`groupEn` varchar(120) NOT NULL DEFAULT 'General',
	`groupAr` varchar(120) NOT NULL DEFAULT 'عام',
	`groupBn` varchar(120) NOT NULL DEFAULT 'সাধারণ',
	`labelEn` varchar(160) NOT NULL,
	`labelAr` varchar(160) NOT NULL,
	`labelBn` varchar(160) NOT NULL,
	`valueEn` text NOT NULL,
	`valueAr` text NOT NULL,
	`valueBn` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productSpecifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`slug` varchar(180) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameBn` varchar(255) NOT NULL,
	`shortDescriptionEn` text,
	`shortDescriptionAr` text,
	`shortDescriptionBn` text,
	`descriptionEn` text,
	`descriptionAr` text,
	`descriptionBn` text,
	`imageUrl` text,
	`badgeEn` varchar(80),
	`badgeAr` varchar(80),
	`badgeBn` varchar(80),
	`isFeatured` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(180),
	`body` text NOT NULL,
	`language` enum('en','ar','bn') NOT NULL DEFAULT 'en',
	`status` enum('pending','approved','hidden') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(160) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `socialLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`network` enum('facebook','instagram','x','whatsapp','youtube','tiktok') NOT NULL,
	`url` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_links_network_unique` UNIQUE(`network`)
);
