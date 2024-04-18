<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options') || isset($_SESSION['regionObj']))
{
    $json = file_get_contents('php://input');
    $member = json_decode($json);
    
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    if(!$member->fullName || !$member->dateOfBirth || !$member->fpuDate
    || !$member->areaId || !$member->citizenship || !$member->phone || !$member->passport
    || !$member->id || !$member->year
    || (!!$member->otherFederationMembership && (!$member->lastAlterEventDate || !$member->reFpuDate))) 
    {
        http_response_code(400);
        return;
    }

    $sql = $wpdb->prepare("INSERT INTO $table_pc_members (
        fullName,
        dateOfBirth,
        citizenship,
        `id`,
        passport,
        `address`,
        phone,
        email,
        job,
        position,
        jobAddress,
        isInOtherFederation,
        fpuDate,
        areaId,
        `class`,
        `rank`,
        refereeCategory,
        lastAlterEventDate,
        reFpuDate
    ) VALUES (%s, %s, %s, %s, %s, %s, %d, %s, %s, %s, %s, %d, %s, %d, %s, %s, %s, %s, %s)", 
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
        $member->areaId,
        $member->class,
        $member->rank,
        $member->refereeCategory,
        $member->lastAlterEventDate,
        $member->reFpuDate
    );
    
    $wpdb->query($sql);

    if($member->isContributed)
    {
        $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";
        $sql = $wpdb->prepare("INSERT INTO $table_pc_log (memberId, createDate) 
        VALUES (%d, %s)", $wpdb->insert_id, date("Y-m-d h:i:s", mktime(date("h"), date("i"), date("s"), date("m"), date("d"), $member->year)));
        $wpdb->query($sql);
    }
} else {
    http_response_code(401);
}