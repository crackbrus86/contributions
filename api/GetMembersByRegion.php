<?php
require_once("../../../../wp-load.php");
global $wpdb;
define('API_DIR', plugin_dir_path(__FILE__));
require_once(API_DIR . "./Utils.php");

if(isset($_SESSION['regionObj']))
{
    $region_id = $_SESSION['regionObj']->id;
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $table_regions = $wpdb->get_blog_prefix() . "regions";
    $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";
    $sql = $wpdb->prepare("SELECT
        members.memberId,
        fullName,
        dateOfBirth,
        citizenship,
        members.id,
        passport,
        address,
        phone,
        members.email,
        job,
        position,
        jobAddress,
        isInOtherFederation as otherFederationMembership,
        fpuDate,
        areaId,
        regions.name as area,
        CASE WHEN log.contributionId IS NOT NULL THEN 1 ELSE 0 END as isContributed,
        class,
        rank,
        refereeCategory
    FROM $table_pc_members AS members
    JOIN $table_regions AS regions ON regions.id = members.areaId
    LEFT JOIN $table_pc_log AS log ON log.memberId = members.memberId AND YEAR(log.createDate) = %s
    WHERE members.areaId = %d
    ORDER BY fullName", date("Y"), $region_id);

    $result = $wpdb->get_results($sql);
    $result = array_map("membersMap", $result);
    $members = json_encode($result);
    print_r($members);
} else {
    http_response_code(401);
}