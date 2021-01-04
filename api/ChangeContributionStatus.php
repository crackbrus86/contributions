<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $json = file_get_contents('php://input');
    $model = json_decode($json);

    $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";

    $sqlLogDel = $wpdb->prepare("DELETE FROM $table_pc_log 
        WHERE memberId = %d AND YEAR(createDate) = %s", 
        $model->memberId, date("Y"));
    $wpdb->query($sqlLogDel);

    if($model->isContributed)
    {
        $sqlLogInsrt = $wpdb->prepare("INSERT INTO $table_pc_log (memberId, createDate) 
        VALUES (%d, %s)",
        $model->memberId, date("Y-m-d h:i:s"));
        $wpdb->query($sqlLogInsrt);
    }
} else {
    http_response_code(401);
}