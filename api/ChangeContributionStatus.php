<?php
require_once("../../../../wp-load.php");
global $wpdb;

if(current_user_can('manage_options'))
{
    $json = file_get_contents('php://input');
    $model = json_decode($json);

    if($model->memberId == NULL || $model->year == NULL)
    {
        http_response_code(400);
        return;
    }

    $table_pc_log = $wpdb->get_blog_prefix() . "pc_log";

    $sqlLogDel = $wpdb->prepare("DELETE FROM $table_pc_log 
        WHERE memberId = %d AND YEAR(createDate) = %s", 
        $model->memberId, $model->year);
    $wpdb->query($sqlLogDel);

    if($model->isContributed)
    {
        $sqlLogInsrt = $wpdb->prepare("INSERT INTO $table_pc_log (memberId, createDate) 
        VALUES (%d, %s)",
        $model->memberId, date("Y-m-d h:i:s", mktime(date("h"), date("i"), date("s"), date("m"), date("d"), $model->year)));
        $wpdb->query($sqlLogInsrt);
    }
} else {
    http_response_code(401);
}