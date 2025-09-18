<?php
/**
 * Plugin Name: Quiz Sicurezza sul Lavoro
 * Plugin URI: https://spazioimpresamatera.it
 * Description: Quiz interattivo per la valutazione della sicurezza sul lavoro basato su D.Lgs. 81/08. Include algoritmi avanzati di scoring, insights dinamici e sistema di lead generation integrato.
 * Version: 1.0.0
 * Author: Spazio Impresa
 * Author URI: https://spazioimpresamatera.it
 * License: GPL v2 or later
 * Text Domain: quiz-sicurezza
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('QUIZ_SICUREZZA_VERSION', '1.0.0');
define('QUIZ_SICUREZZA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('QUIZ_SICUREZZA_PLUGIN_PATH', plugin_dir_path(__FILE__));

class QuizSicurezzaPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('quiz_sicurezza', array($this, 'shortcode_handler'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_save_quiz_result', array($this, 'save_quiz_result'));
        add_action('wp_ajax_nopriv_save_quiz_result', array($this, 'save_quiz_result'));
        register_activation_hook(__FILE__, array($this, 'activate_plugin'));
    }

    public function init() {
        // Initialize plugin
    }

    public function activate_plugin() {
        // Create database table for quiz results
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'quiz_sicurezza_results';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            submission_time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            user_ip varchar(45) NOT NULL,
            sector varchar(50) NOT NULL,
            management_type varchar(50) NOT NULL,
            employees varchar(20) NOT NULL,
            risk_level varchar(20) NOT NULL,
            risk_score int NOT NULL,
            violations text,
            answers text NOT NULL,
            contact_phone varchar(20),
            contact_email varchar(100),
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public function enqueue_scripts() {
        // Check if we're on a page that contains the shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'quiz_sicurezza')) {
            // Enqueue the built React application
            wp_enqueue_script(
                'quiz-sicurezza-app',
                QUIZ_SICUREZZA_PLUGIN_URL . 'assets/quiz-app.js',
                array(),
                QUIZ_SICUREZZA_VERSION,
                true
            );
            
            wp_enqueue_style(
                'quiz-sicurezza-style',
                QUIZ_SICUREZZA_PLUGIN_URL . 'assets/quiz-app.css',
                array(),
                QUIZ_SICUREZZA_VERSION
            );

            // Localize script for AJAX
            wp_localize_script('quiz-sicurezza-app', 'quizAjax', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('quiz_sicurezza_nonce')
            ));
        }
    }

    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => 'auto'
        ), $atts, 'quiz_sicurezza');

        // Return the container div where React will mount
        return '<div id="quiz-sicurezza-root" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';"></div>';
    }

    public function save_quiz_result() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'quiz_sicurezza_nonce')) {
            wp_die('Security check failed');
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'quiz_sicurezza_results';

        $result = $wpdb->insert(
            $table_name,
            array(
                'user_ip' => $_SERVER['REMOTE_ADDR'],
                'sector' => sanitize_text_field($_POST['sector']),
                'management_type' => sanitize_text_field($_POST['management_type']),
                'employees' => sanitize_text_field($_POST['employees']),
                'risk_level' => sanitize_text_field($_POST['risk_level']),
                'risk_score' => intval($_POST['risk_score']),
                'violations' => sanitize_textarea_field($_POST['violations']),
                'answers' => sanitize_textarea_field($_POST['answers']),
                'contact_phone' => sanitize_text_field($_POST['contact_phone']),
                'contact_email' => sanitize_email($_POST['contact_email'])
            ),
            array('%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s')
        );

        if ($result !== false) {
            wp_send_json_success('Result saved successfully');
        } else {
            wp_send_json_error('Failed to save result');
        }
    }

    public function add_admin_menu() {
        add_menu_page(
            'Quiz Sicurezza',
            'Quiz Sicurezza',
            'manage_options',
            'quiz-sicurezza',
            array($this, 'admin_page'),
            'dashicons-shield-alt',
            30
        );
        
        add_submenu_page(
            'quiz-sicurezza',
            'Risultati Quiz',
            'Risultati',
            'manage_options',
            'quiz-sicurezza-results',
            array($this, 'results_page')
        );
        
        add_submenu_page(
            'quiz-sicurezza',
            'Impostazioni',
            'Impostazioni',
            'manage_options',
            'quiz-sicurezza-settings',
            array($this, 'settings_page')
        );
    }

    public function admin_page() {
        include_once QUIZ_SICUREZZA_PLUGIN_PATH . 'admin/dashboard.php';
    }

    public function results_page() {
        include_once QUIZ_SICUREZZA_PLUGIN_PATH . 'admin/results.php';
    }

    public function settings_page() {
        include_once QUIZ_SICUREZZA_PLUGIN_PATH . 'admin/settings.php';
    }
}

// Initialize the plugin
new QuizSicurezzaPlugin();
?>