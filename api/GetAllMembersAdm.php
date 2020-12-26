<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $table_regions = $wpdb->get_blog_prefix() . "regions";
    $sql = "SELECT
        memberId,
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
        0 as isContributed
    FROM $table_pc_members AS members
    JOIN $table_regions AS regions ON regions.id = members.areaId";

    $result = $wpdb->get_results($sql);
    $result = array_map("membersMap", $result);
    $members = json_encode($result);
    print_r($members);
} else {
    http_response_code(401);
}

function membersMap($member)
{
    $nextMember = $member;
    $nextMember->otherFederationMembership = (bool) $nextMember->otherFederationMembership;
    $nextMember->isContributed = (bool) $nextMember->isContributed;
    return $nextMember;
}