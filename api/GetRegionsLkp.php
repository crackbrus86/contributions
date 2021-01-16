<?php
require_once("../../../../wp-load.php");
global $wpdb;

$table_regions = $wpdb->get_blog_prefix() . "regions";
$sql = "SELECT
    id,
    name
FROM $table_regions";

$result = $wpdb->get_results($sql);
$regions = json_encode($result);
print_r($regions);