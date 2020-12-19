<?php
require_once("../../../../wp-load.php");
global $wpdb;
$json = file_get_contents('php://input');
$member = json_decode($json);

$table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
$sql = $wpdb->prepare("INSERT INTO $table_pc_members (
    fullName,
    dateOfBirth,
    citizenship,
    id,
    passport,
    address,
    phone,
    email,
    job,
    position,
    jobAddress,
    isInOtherFederation,
    fpuDate,
    areaId
) VALUES (%s, %s, %s, %d, %s, %s, %d, %s, %s, %s, %s, %d, %s, %d)", 
    $member->fullName, 
    $member->dateOfBirth,
    $member->citizenship,
    $member->id,
    $member->passport,
    $member->address,
    $member->phone,
    $member->email,
    $member->job,
    $member->position,
    $member->jobAddress,
    $member->otherFederationMembership,
    $member->fpuDate,
    $member->areaId
);

$wpdb->query($sql);