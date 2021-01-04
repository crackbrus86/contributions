<?php
/*
Plugin Name: Contributions
Description: UPF Contributions
Version: 1.0
Author: Salivon Eugene
*/
define('CNTR_DIR', plugin_dir_path(__FILE__));
add_action("admin_menu", array("Contributions", "initSettings"));
add_action("admin_init", array("Contributions", "initDb"));

function getRegionClient()
{
    wp_register_script('clientAppRegion', plugins_url('/dist/bundle.js?v='.time(), __FILE__));
    wp_enqueue_script('clientAppRegion');
    if(isset($_SESSION['regionObj']))
    { 
        ?>
            <div id="usrInfo" data-info="<?php print($_SESSION['regionObj']->id); ?>"></div>
            <div class="container-fluid">
                <div id="cntrAdmApp"></div>
            </div>
        <?php
    } else {
        echo "<script>window.location.replace('".get_home_url()."')</script>";
    }
}
add_shortcode('pcRegion', 'getRegionClient');

class Contributions {
    public function initSettings(){
        add_menu_page("Contributions", "Члени ФПУ", "manage_options", "contributions", array("Contributions", "contributionsAdmin"));
    }

    public function contributionsAdmin() {
        wp_register_script('clientApp', plugins_url('/dist/bundle.js?v='.time(), __FILE__));
        wp_enqueue_script('clientApp');
        ?>
        <div id="usrInfo" data-info="<?php print(get_current_user_id()); ?>"></div>
        <div class="container-fluid">
            <div id="cntrAdmApp"></div>
        </div>
        <?php
    }

    public function initDb(){
        require_once(CNTR_DIR . "./db.init.php");
    }
}