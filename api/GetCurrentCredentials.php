<?php
require_once("../../../../wp-load.php");
global $wpdb;
$user_id = $_GET['user_id'];
$credentials = new StdClass();
$current_uid = get_current_user_id();
$region_id = $_SESSION['regionObj']->id;

if(!!$user_id && $user_id == $current_uid)
{
    $credentials->uid = $current_uid;
    $credentials->app_type = 'admin';
}
elseif(!!$user_id && $user_id == $region_id)
{
    $credentials->uid = $region_id;
    $credentials->app_type = 'region';
}
else
{
    $credentials->uid = NULL;
    $credentials->app_type = 'common';
}



echo json_encode($credentials);