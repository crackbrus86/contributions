<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $json = file_get_contents('php://input');
    $member = json_decode($json);
    if(!$member->memberId) 
    {
        http_response_code(400);
        return;
    }
    
    $table_pc_members = $wpdb->get_blog_prefix() . "pc_members";
    $sql = $wpdb->prepare("DELETE FROM $table_pc_members 
        WHERE memberId = %s", $member->memberId);

    $wpdb->query($sql);

    $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";

    $sqlLogDel = $wpdb->prepare("DELETE FROM $table_pc_log 
        WHERE memberId = %s", $member->memberId);
    $wpdb->query($sqlLogDel);
} else {
    http_response_code(401);
}