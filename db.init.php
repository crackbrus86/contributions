<?php
global $wpdb;
$charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset} COLLATE {$wpdb->collate}";
require_once(ABSPATH . "wp-admin/includes/upgrade.php");

$members_table = $wpdb->get_blog_prefix() . "pc_members";
$sql = "CREATE TABLE IF NOT EXISTS {$members_table} (
    `memberId` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `fullName` VARCHAR(300) NOT NULL,
	`dateOfBirth` DATETIME NOT NULL,
	`citizenship` VARCHAR(100) NOT NULL,
	`id` INT NOT NULL,
	`passport` VARCHAR(500) NOT NULL,
	`address` VARCHAR(300) NOT NULL,
	`phone` INT NOT NULL,
	`email` VARCHAR(100) NULL,
	`job` VARCHAR(100) NOT NULL,
	`position` VARCHAR(100) NULL,
	`jobAddress` VARCHAR(300) NULL,
	`isInOtherFederation` BIT NOT NULL,
	`fpuDate` DATETIME NOT NULL,
	`areaId` INT NOT NULL 
) {$charset_collate}";
dbDelta($sql);