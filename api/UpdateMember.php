<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $json = file_get_contents('php://input');
    $member = json_decode($json);
    if(!$member->fullName || !$member->dateOfBirth || !$member->fpuDate
    || !$member->areaId || !$member->citizenship || !$member->phone || !$member->passport) 
    {
        http_response_code(400);
        return;
    }
    
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $sql = $wpdb->prepare("UPDATE $table_pc_members 
        SET 
            fullName = %s,
            dateOfBirth = %s,
            citizenship = %s,
            id = %s,
            passport = %s,
            address = %s,
            phone = %d,
            email = %s,
            job = %s,
            position = %s,
            jobAddress = %s,
            isInOtherFederation = %d,
            fpuDate = %s,
            areaId = %d
        WHERE memberId = %d",
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
            $member->memberId    
        );
    
    $wpdb->query($sql);

    $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";

    $sqlLogDel = $wpdb->prepare("DELETE FROM $table_pc_log 
        WHERE memberId = %d AND YEAR(createDate) = %s", 
        $member->memberId, date("Y"));
    $wpdb->query($sqlLogDel);

    if($member->isContributed)
    {
        $sqlLogInsrt = $wpdb->prepare("INSERT INTO $table_pc_log (memberId, createDate) 
        VALUES (%d, %s)",
        $member->memberId, date("Y-m-d h:i:s"));
        $wpdb->query($sqlLogInsrt);
    }

} else {
    http_response_code(401);
}