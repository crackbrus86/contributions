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
	`id` VARCHAR(12) NOT NULL,
	`passport` VARCHAR(500) NOT NULL,
	`address` VARCHAR(300) NOT NULL,
	`phone` BIGINT(12) NOT NULL,
	`email` VARCHAR(100) NULL,
	`job` VARCHAR(100) NOT NULL,
	`position` VARCHAR(100) NULL,
	`jobAddress` VARCHAR(300) NULL,
	`isInOtherFederation` BIT NOT NULL,
	`fpuDate` DATETIME NOT NULL,
	`lastAlterEventDate` DATETIME NULL,
	`reFpuDate` DATETIME NULL,
	`areaId` INT NOT NULL,
	`class` VARCHAR(10) NULL,
	`rank` VARCHAR(10) NULL,
	`refereeCategory` VARCHAR(10) NULL
) {$charset_collate}";
dbDelta($sql);

$contributions_table = $wpdb->get_blog_prefix() . "pc_log";
$sql = "CREATE TABLE IF  NOT EXISTS {$contributions_table} (
	`contributionId` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`memberId` BIGINT NOT NULL,
	`createDate` DATETIME NOT NULL
) {$charset_collate}";
dbDelta($sql);