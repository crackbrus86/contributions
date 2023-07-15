<?php
require_once("../../../../wp-load.php");
global $wpdb;
define('API_DIR', plugin_dir_path(__FILE__));
require_once(API_DIR . "./Utils.php");

if(current_user_can("manage_options"))
{
    $year = $_GET["year"];
    $areaId = $_GET["areaId"];
    $onlyReferee = $_GET["onlyReferee"];
    $yearOfBirth = $_GET["yearOfBirth"];

    if($year == NULL || $areaId == NULL)
    {
        http_response_code(400);
        return;
    }

    if($yearOfBirth == 'null' || $yearOfBirth == NULL)
        $yearOfBirth = '';

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
        members.rank,
        refereeCategory,
        lastAlterEventDate,
        reFpuDate
    FROM $table_pc_members AS members
    JOIN $table_regions AS regions ON regions.id = members.areaId
    LEFT JOIN $table_pc_log AS log ON log.memberId = members.memberId AND YEAR(log.createDate) = %s
    WHERE (YEAR(members.dateOfBirth) = %s OR %s = '')
        AND (regions.id = %d OR %d = 0) 
        AND (
                (IFNULL(refereeCategory, '') <> '') OR %d = 0
            )
    ORDER BY fullName", $year, $yearOfBirth, $yearOfBirth, $areaId, $areaId, $onlyReferee);

    $result = $wpdb->get_results($sql);
    $result = array_map("membersMap", $result);
    $members = json_encode($result);
    print_r($members);
} else {
    http_response_code(401);
}