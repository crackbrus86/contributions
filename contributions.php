<?php
/*
Plugin Name: Contributions
Description: UPF Contributions
Version: 1.0
Author: Salivon Eugene
*/
define('CNTR_DIR', plugin_dir_path(__FILE__));
add_action("admin_menu", array("Contributions", "initSettings"));

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
}