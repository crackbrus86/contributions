<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $sql = "SELECT
        memberId,
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
        isInOtherFederation as otherFederationMembership,
        fpuDate,
        areaId,
        'Полтавська' as area,
        0 as isContributed
    FROM $table_pc_members";

    $result = $wpdb->get_results($sql);
    $members = json_encode($result);
    print_r($members);
} else {
    http_response_code(400);
}