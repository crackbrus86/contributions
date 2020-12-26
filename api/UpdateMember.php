<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $json = file_get_contents('php://input');
    $member = json_decode($json);
    
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $sql = $wpdb->prepare("UPDATE $table_pc_members 
        SET 
            fullName = %s,
            dateOfBirth = %s,
            citizenship = %s,
            id = %d,
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
} else {
    http_response_code(401);
}