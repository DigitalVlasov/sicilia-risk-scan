<?php
/**
 * Quiz Sicurezza Lavoro - WordPress Integration Functions
 * Versione: 2025
 * 
 * ISTRUZIONI IMPLEMENTAZIONE:
 * 1. Copia questo codice nel file functions.php del tuo tema WordPress
 * 2. Salva il file HTML come pagina WordPress o template
 * 3. Testa il funzionamento su una pagina di prova
 * 
 * SICUREZZA IMPLEMENTATA:
 * - Nonce verification per AJAX
 * - Input sanitization
 * - Rate limiting
 * - SQL injection prevention
 * - XSS protection
 * - CSRF tokens
 */

// Previeni accesso diretto
if (!defined('ABSPATH')) {
    exit;
}

/**
 * ========== CONFIGURAZIONE SICUREZZA ==========
 */

// Rate limiting configuration
define('QUIZ_RATE_LIMIT_REQUESTS', 10); // Richieste per periodo
define('QUIZ_RATE_LIMIT_PERIOD', 600);  // Periodo in secondi (10 minuti)

/**
 * Inizializzazione del plugin Quiz Sicurezza
 */
add_action('init', 'quiz_sicurezza_init');
function quiz_sicurezza_init() {
    // Registra shortcode
    add_shortcode('quiz_sicurezza', 'quiz_sicurezza_shortcode');
    
    // Aggiungi AJAX handlers
    add_action('wp_ajax_submit_quiz_lead', 'handle_quiz_lead_submission');
    add_action('wp_ajax_nopriv_submit_quiz_lead', 'handle_quiz_lead_submission');
    add_action('wp_ajax_log_quiz_error', 'handle_quiz_error_logging');
    add_action('wp_ajax_nopriv_log_quiz_error', 'handle_quiz_error_logging');
    add_action('wp_ajax_track_quiz_exit', 'handle_quiz_exit_tracking');
    add_action('wp_ajax_nopriv_track_quiz_exit', 'handle_quiz_exit_tracking');
    
    // Crea tabelle se non esistono
    quiz_sicurezza_create_tables();
}

/**
 * Shortcode per inserire il quiz in pagine/post
 * Uso: [quiz_sicurezza]
 */
function quiz_sicurezza_shortcode($atts) {
    $atts = shortcode_atts(array(
        'title' => 'Test di Conformità Sicurezza Lavoro',
        'show_logo' => 'true'
    ), $atts);
    
    // Enqueue scripts e styles necessari
    wp_enqueue_script('quiz-sicurezza-js', get_template_directory_uri() . '/js/quiz-sicurezza.js', array(), '2025.1', true);
    wp_enqueue_style('quiz-sicurezza-css', get_template_directory_uri() . '/css/quiz-sicurezza.css', array(), '2025.1');
    
    // Aggiungi nonce per sicurezza AJAX
    wp_localize_script('quiz-sicurezza-js', 'quiz_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('quiz_sicurezza_nonce'),
        'rate_limit_exceeded' => 'Troppe richieste. Riprova tra qualche minuto.',
        'error_generic' => 'Si è verificato un errore. Riprova più tardi.'
    ));
    
    // Includi il contenuto del quiz
    ob_start();
    include locate_template('quiz-sicurezza-template.php') ?: plugin_dir_path(__FILE__) . 'quiz-sicurezza-wordpress.html';
    return ob_get_clean();
}

/**
 * ========== GESTIONE DATABASE ==========
 */

/**
 * Crea tabelle necessarie per il quiz
 */
function quiz_sicurezza_create_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // Tabella per salvare i lead/risultati
    $table_leads = $wpdb->prefix . 'quiz_sicurezza_leads';
    $sql_leads = "CREATE TABLE $table_leads (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        email varchar(255),
        phone varchar(50),
        company_name varchar(255),
        sector varchar(100),
        employees varchar(50),
        management_type varchar(100),
        risk_level varchar(20),
        violations_count int(3),
        total_score int(5),
        quiz_answers longtext,
        ip_address varchar(45),
        user_agent text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        consent_privacy tinyint(1) DEFAULT 0,
        consent_marketing tinyint(1) DEFAULT 0,
        PRIMARY KEY (id),
        INDEX idx_created_at (created_at),
        INDEX idx_risk_level (risk_level),
        INDEX idx_sector (sector)
    ) $charset_collate;";
    
    // Tabella per rate limiting
    $table_rate_limit = $wpdb->prefix . 'quiz_sicurezza_rate_limit';
    $sql_rate_limit = "CREATE TABLE $table_rate_limit (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        ip_address varchar(45) NOT NULL,
        request_count int(5) DEFAULT 1,
        first_request datetime DEFAULT CURRENT_TIMESTAMP,
        last_request datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_ip (ip_address),
        INDEX idx_last_request (last_request)
    ) $charset_collate;";
    
    // Tabella per logging errori
    $table_errors = $wpdb->prefix . 'quiz_sicurezza_errors';
    $sql_errors = "CREATE TABLE $table_errors (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        error_message text,
        error_url varchar(500),
        user_agent text,
        ip_address varchar(45),
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_created_at (created_at)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_leads);
    dbDelta($sql_rate_limit);
    dbDelta($sql_errors);
}

/**
 * ========== SICUREZZA E VALIDAZIONE ==========
 */

/**
 * Verifica nonce e rate limiting
 */
function quiz_sicurezza_security_check() {
    // Verifica nonce
    if (!wp_verify_nonce($_POST['nonce'], 'quiz_sicurezza_nonce')) {
        wp_die('Errore di sicurezza: nonce non valido');
    }
    
    // Verifica rate limiting
    if (!quiz_sicurezza_check_rate_limit()) {
        wp_send_json_error('Troppe richieste. Riprova tra qualche minuto.');
    }
    
    return true;
}

/**
 * Rate limiting implementation
 */
function quiz_sicurezza_check_rate_limit() {
    global $wpdb;
    
    $ip_address = quiz_sicurezza_get_client_ip();
    $table_name = $wpdb->prefix . 'quiz_sicurezza_rate_limit';
    $current_time = current_time('mysql');
    $period_start = date('Y-m-d H:i:s', strtotime($current_time) - QUIZ_RATE_LIMIT_PERIOD);
    
    // Pulisci record vecchi
    $wpdb->delete(
        $table_name,
        array('last_request' => array('<', $period_start)),
        array('%s')
    );
    
    // Verifica richieste attuali
    $current_requests = $wpdb->get_var($wpdb->prepare(
        "SELECT request_count FROM $table_name WHERE ip_address = %s AND last_request > %s",
        $ip_address,
        $period_start
    ));
    
    if ($current_requests >= QUIZ_RATE_LIMIT_REQUESTS) {
        return false;
    }
    
    // Aggiorna contatore
    $existing = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE ip_address = %s",
        $ip_address
    ));
    
    if ($existing) {
        $wpdb->update(
            $table_name,
            array(
                'request_count' => $current_requests + 1,
                'last_request' => $current_time
            ),
            array('ip_address' => $ip_address),
            array('%d', '%s'),
            array('%s')
        );
    } else {
        $wpdb->insert(
            $table_name,
            array(
                'ip_address' => $ip_address,
                'request_count' => 1,
                'first_request' => $current_time,
                'last_request' => $current_time
            ),
            array('%s', '%d', '%s', '%s')
        );
    }
    
    return true;
}

/**
 * Ottieni IP del client in modo sicuro
 */
function quiz_sicurezza_get_client_ip() {
    $ip_keys = array(
        'HTTP_CF_CONNECTING_IP',     // CloudFlare
        'HTTP_CLIENT_IP',            // Proxy
        'HTTP_X_FORWARDED_FOR',      // Load Balancer/Proxy
        'HTTP_X_FORWARDED',          // Proxy
        'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
        'HTTP_FORWARDED_FOR',        // Proxy
        'HTTP_FORWARDED',            // Proxy
        'REMOTE_ADDR'                // Standard
    );
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
}

/**
 * Sanitizza input in modo sicuro
 */
function quiz_sicurezza_sanitize_input($input, $type = 'text') {
    switch ($type) {
        case 'email':
            return sanitize_email($input);
        case 'phone':
            return preg_replace('/[^0-9+\-\s\(\)]/', '', $input);
        case 'url':
            return esc_url_raw($input);
        case 'textarea':
            return sanitize_textarea_field($input);
        case 'int':
            return intval($input);
        case 'float':
            return floatval($input);
        case 'json':
            $decoded = json_decode($input, true);
            return $decoded !== null ? wp_json_encode($decoded) : '';
        default:
            return sanitize_text_field($input);
    }
}

/**
 * ========== AJAX HANDLERS ==========
 */

/**
 * Gestisce invio lead dal quiz
 */
function handle_quiz_lead_submission() {
    global $wpdb;
    
    try {
        // Verifica sicurezza
        quiz_sicurezza_security_check();
        
        // Sanitizza input
        $data = array(
            'email' => quiz_sicurezza_sanitize_input($_POST['email'], 'email'),
            'phone' => quiz_sicurezza_sanitize_input($_POST['phone'], 'phone'),
            'company_name' => quiz_sicurezza_sanitize_input($_POST['company_name']),
            'sector' => quiz_sicurezza_sanitize_input($_POST['sector']),
            'employees' => quiz_sicurezza_sanitize_input($_POST['employees']),
            'management_type' => quiz_sicurezza_sanitize_input($_POST['management_type']),
            'risk_level' => quiz_sicurezza_sanitize_input($_POST['risk_level']),
            'violations_count' => quiz_sicurezza_sanitize_input($_POST['violations_count'], 'int'),
            'total_score' => quiz_sicurezza_sanitize_input($_POST['total_score'], 'int'),
            'quiz_answers' => quiz_sicurezza_sanitize_input($_POST['quiz_answers'], 'json'),
            'ip_address' => quiz_sicurezza_get_client_ip(),
            'user_agent' => sanitize_text_field($_SERVER['HTTP_USER_AGENT']),
            'consent_privacy' => isset($_POST['consent_privacy']) ? 1 : 0,
            'consent_marketing' => isset($_POST['consent_marketing']) ? 1 : 0
        );
        
        // Validazione aggiuntiva
        if (empty($data['email']) || !is_email($data['email'])) {
            wp_send_json_error('Email non valida');
        }
        
        if (empty($data['company_name'])) {
            wp_send_json_error('Nome azienda richiesto');
        }
        
        if (!$data['consent_privacy']) {
            wp_send_json_error('Consenso privacy richiesto');
        }
        
        // Salva nel database
        $table_name = $wpdb->prefix . 'quiz_sicurezza_leads';
        $result = $wpdb->insert($table_name, $data, array(
            '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s', '%s', '%d', '%d'
        ));
        
        if ($result === false) {
            error_log('Quiz Sicurezza DB Error: ' . $wpdb->last_error);
            wp_send_json_error('Errore nel salvataggio. Riprova.');
        }
        
        // Invia notifica email all'admin (opzionale)
        if (get_option('quiz_sicurezza_notify_admin', true)) {
            quiz_sicurezza_send_admin_notification($data);
        }
        
        // Invia email di follow-up all'utente (opzionale)
        if (get_option('quiz_sicurezza_send_followup', true)) {
            quiz_sicurezza_send_user_followup($data);
        }
        
        wp_send_json_success(array(
            'message' => 'Dati salvati con successo',
            'lead_id' => $wpdb->insert_id
        ));
        
    } catch (Exception $e) {
        error_log('Quiz Sicurezza Error: ' . $e->getMessage());
        wp_send_json_error('Errore interno del server');
    }
}

/**
 * Logging errori client-side
 */
function handle_quiz_error_logging() {
    global $wpdb;
    
    try {
        quiz_sicurezza_security_check();
        
        $table_name = $wpdb->prefix . 'quiz_sicurezza_errors';
        $wpdb->insert(
            $table_name,
            array(
                'error_message' => sanitize_textarea_field($_POST['error']),
                'error_url' => esc_url_raw($_POST['url']),
                'user_agent' => sanitize_text_field($_POST['userAgent']),
                'ip_address' => quiz_sicurezza_get_client_ip()
            ),
            array('%s', '%s', '%s', '%s')
        );
        
        wp_send_json_success();
        
    } catch (Exception $e) {
        error_log('Quiz Error Logging failed: ' . $e->getMessage());
        wp_send_json_error();
    }
}

/**
 * Tracking uscite dal quiz
 */
function handle_quiz_exit_tracking() {
    // Analytics per comportamento utenti
    try {
        quiz_sicurezza_security_check();
        
        $analytics_data = array(
            'stage' => sanitize_text_field($_POST['stage']),
            'progress' => intval($_POST['progress']),
            'answers_count' => intval($_POST['answers']),
            'ip_address' => quiz_sicurezza_get_client_ip(),
            'timestamp' => current_time('mysql')
        );
        
        // Salva in opzione WordPress per analytics
        $existing_analytics = get_option('quiz_sicurezza_analytics', array());
        $existing_analytics[] = $analytics_data;
        
        // Mantieni solo ultimi 1000 record
        if (count($existing_analytics) > 1000) {
            $existing_analytics = array_slice($existing_analytics, -1000);
        }
        
        update_option('quiz_sicurezza_analytics', $existing_analytics);
        
        wp_send_json_success();
        
    } catch (Exception $e) {
        wp_send_json_error();
    }
}

/**
 * ========== EMAIL NOTIFICATIONS ==========
 */

/**
 * Invia notifica admin per nuovo lead
 */
function quiz_sicurezza_send_admin_notification($data) {
    $admin_email = get_option('admin_email');
    $site_name = get_bloginfo('name');
    
    $subject = sprintf('[%s] Nuovo Lead Quiz Sicurezza - Rischio %s', $site_name, $data['risk_level']);
    
    $message = sprintf(
        "Nuovo lead dal Quiz Sicurezza Lavoro:\n\n" .
        "Azienda: %s\n" .
        "Email: %s\n" .
        "Telefono: %s\n" .
        "Settore: %s\n" .
        "Dipendenti: %s\n" .
        "Gestione: %s\n" .
        "Livello Rischio: %s\n" .
        "Criticità: %d\n" .
        "Punteggio: %d\n\n" .
        "Data: %s\n" .
        "IP: %s\n\n" .
        "Risposte Quiz: %s",
        $data['company_name'],
        $data['email'],
        $data['phone'],
        $data['sector'],
        $data['employees'],
        $data['management_type'],
        $data['risk_level'],
        $data['violations_count'],
        $data['total_score'],
        current_time('d/m/Y H:i'),
        $data['ip_address'],
        $data['quiz_answers']
    );
    
    wp_mail($admin_email, $subject, $message);
}

/**
 * Invia email di follow-up all'utente
 */
function quiz_sicurezza_send_user_followup($data) {
    $subject = sprintf('I risultati del tuo Test Sicurezza - Rischio %s', $data['risk_level']);
    
    $message = sprintf(
        "Gentile %s,\n\n" .
        "Grazie per aver completato il nostro Test di Conformità Sicurezza Lavoro.\n\n" .
        "I tuoi risultati:\n" .
        "- Livello di Rischio: %s\n" .
        "- Criticità rilevate: %d\n\n" .
        "Un nostro consulente ti contatterà entro 2 ore lavorative per fornirti:\n" .
        "✅ Analisi dettagliata personalizzata\n" .
        "✅ Piano d'azione specifico\n" .
        "✅ Cronoprogramma delle priorità\n" .
        "✅ Calcolo costi di non conformità\n\n" .
        "Nel frattempo, se hai urgenze puoi chiamarci al 095 587 2480 o scriverci su WhatsApp.\n\n" .
        "Cordiali saluti,\n" .
        "Il Team di Spazio Impresa\n\n" .
        "---\n" .
        "Questo è un messaggio automatico. Le tue informazioni sono trattate secondo la nostra Privacy Policy.",
        $data['company_name'],
        $data['risk_level'],
        $data['violations_count']
    );
    
    $headers = array(
        'From: Spazio Impresa <noreply@' . $_SERVER['HTTP_HOST'] . '>',
        'Reply-To: info@spazioimpresa.it'
    );
    
    wp_mail($data['email'], $subject, $message, $headers);
}

/**
 * ========== ADMIN DASHBOARD ==========
 */

/**
 * Aggiungi menu amministratore
 */
add_action('admin_menu', 'quiz_sicurezza_admin_menu');
function quiz_sicurezza_admin_menu() {
    add_management_page(
        'Quiz Sicurezza Leads',
        'Quiz Sicurezza',
        'manage_options',
        'quiz-sicurezza-leads',
        'quiz_sicurezza_admin_page'
    );
}

/**
 * Pagina amministratore per visualizzare leads
 */
function quiz_sicurezza_admin_page() {
    global $wpdb;
    
    if (!current_user_can('manage_options')) {
        wp_die('Non hai i permessi necessari per accedere a questa pagina.');
    }
    
    // Gestisci azioni
    if (isset($_POST['action']) && $_POST['action'] === 'export_leads') {
        quiz_sicurezza_export_leads();
    }
    
    // Recupera leads
    $table_name = $wpdb->prefix . 'quiz_sicurezza_leads';
    $leads = $wpdb->get_results(
        "SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 100"
    );
    
    // Statistiche
    $stats = $wpdb->get_row(
        "SELECT 
            COUNT(*) as total_leads,
            COUNT(CASE WHEN risk_level = 'Alto' THEN 1 END) as high_risk,
            COUNT(CASE WHEN risk_level = 'Medio' THEN 1 END) as medium_risk,
            COUNT(CASE WHEN risk_level = 'Basso' THEN 1 END) as low_risk,
            COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week
        FROM $table_name"
    );
    
    ?>
    <div class="wrap">
        <h1>Quiz Sicurezza Lavoro - Leads</h1>
        
        <div class="quiz-stats" style="display: flex; gap: 20px; margin: 20px 0;">
            <div class="stat-box" style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                <h3>Totale Leads</h3>
                <p style="font-size: 24px; margin: 0;"><?php echo $stats->total_leads; ?></p>
            </div>
            <div class="stat-box" style="background: #ffebee; padding: 15px; border-radius: 5px;">
                <h3>Rischio Alto</h3>
                <p style="font-size: 24px; margin: 0; color: #d32f2f;"><?php echo $stats->high_risk; ?></p>
            </div>
            <div class="stat-box" style="background: #fff3e0; padding: 15px; border-radius: 5px;">
                <h3>Rischio Medio</h3>
                <p style="font-size: 24px; margin: 0; color: #f57c00;"><?php echo $stats->medium_risk; ?></p>
            </div>
            <div class="stat-box" style="background: #e8f5e8; padding: 15px; border-radius: 5px;">
                <h3>Rischio Basso</h3>
                <p style="font-size: 24px; margin: 0; color: #388e3c;"><?php echo $stats->low_risk; ?></p>
            </div>
            <div class="stat-box" style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
                <h3>Ultima Settimana</h3>
                <p style="font-size: 24px; margin: 0; color: #1976d2;"><?php echo $stats->last_week; ?></p>
            </div>
        </div>
        
        <form method="post" style="margin: 20px 0;">
            <input type="hidden" name="action" value="export_leads">
            <?php wp_nonce_field('quiz_export_nonce'); ?>
            <button type="submit" class="button button-secondary">
                📊 Esporta Leads CSV
            </button>
        </form>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Azienda</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Settore</th>
                    <th>Rischio</th>
                    <th>Criticità</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($leads as $lead): ?>
                <tr>
                    <td><?php echo date('d/m/Y H:i', strtotime($lead->created_at)); ?></td>
                    <td><strong><?php echo esc_html($lead->company_name); ?></strong></td>
                    <td>
                        <a href="mailto:<?php echo esc_attr($lead->email); ?>">
                            <?php echo esc_html($lead->email); ?>
                        </a>
                    </td>
                    <td>
                        <?php if ($lead->phone): ?>
                        <a href="tel:<?php echo esc_attr($lead->phone); ?>">
                            <?php echo esc_html($lead->phone); ?>
                        </a>
                        <?php endif; ?>
                    </td>
                    <td><?php echo esc_html($lead->sector); ?></td>
                    <td>
                        <span class="risk-badge risk-<?php echo strtolower($lead->risk_level); ?>" 
                              style="padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px;
                                     background: <?php 
                                         echo $lead->risk_level === 'Alto' ? '#d32f2f' : 
                                             ($lead->risk_level === 'Medio' ? '#f57c00' : '#388e3c'); 
                                     ?>">
                            <?php echo esc_html($lead->risk_level); ?>
                        </span>
                    </td>
                    <td><?php echo intval($lead->violations_count); ?></td>
                    <td>
                        <a href="https://wa.me/390955872480?text=Lead%20dal%20quiz:%20<?php echo urlencode($lead->company_name); ?>" 
                           target="_blank" class="button button-small">
                            💬 WhatsApp
                        </a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * Esporta leads in CSV
 */
function quiz_sicurezza_export_leads() {
    global $wpdb;
    
    if (!wp_verify_nonce($_POST['_wpnonce'], 'quiz_export_nonce')) {
        wp_die('Errore di sicurezza');
    }
    
    $table_name = $wpdb->prefix . 'quiz_sicurezza_leads';
    $leads = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC", ARRAY_A);
    
    if (empty($leads)) {
        wp_die('Nessun lead da esportare');
    }
    
    $filename = 'quiz-sicurezza-leads-' . date('Y-m-d') . '.csv';
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=' . $filename);
    
    $output = fopen('php://output', 'w');
    
    // Header CSV
    fputcsv($output, array(
        'Data', 'Azienda', 'Email', 'Telefono', 'Settore', 'Dipendenti', 
        'Gestione', 'Rischio', 'Criticità', 'Punteggio', 'IP', 'Privacy', 'Marketing'
    ));
    
    // Dati
    foreach ($leads as $lead) {
        fputcsv($output, array(
            $lead['created_at'],
            $lead['company_name'],
            $lead['email'],
            $lead['phone'],
            $lead['sector'],
            $lead['employees'],
            $lead['management_type'],
            $lead['risk_level'],
            $lead['violations_count'],
            $lead['total_score'],
            $lead['ip_address'],
            $lead['consent_privacy'] ? 'Sì' : 'No',
            $lead['consent_marketing'] ? 'Sì' : 'No'
        ));
    }
    
    fclose($output);
    exit;
}

/**
 * ========== PULIZIA E MANUTENZIONE ==========
 */

/**
 * Pulizia automatica dati vecchi
 */
add_action('wp', 'quiz_sicurezza_schedule_cleanup');
function quiz_sicurezza_schedule_cleanup() {
    if (!wp_next_scheduled('quiz_sicurezza_daily_cleanup')) {
        wp_schedule_event(time(), 'daily', 'quiz_sicurezza_daily_cleanup');
    }
}

add_action('quiz_sicurezza_daily_cleanup', 'quiz_sicurezza_cleanup_old_data');
function quiz_sicurezza_cleanup_old_data() {
    global $wpdb;
    
    // Elimina rate limit vecchi (più di 1 giorno)
    $wpdb->delete(
        $wpdb->prefix . 'quiz_sicurezza_rate_limit',
        array('last_request' => array('<', date('Y-m-d H:i:s', strtotime('-1 day')))),
        array('%s')
    );
    
    // Elimina errori vecchi (più di 30 giorni)
    $wpdb->delete(
        $wpdb->prefix . 'quiz_sicurezza_errors',
        array('created_at' => array('<', date('Y-m-d H:i:s', strtotime('-30 days')))),
        array('%s')
    );
    
    // Pulisci analytics cache
    $analytics = get_option('quiz_sicurezza_analytics', array());
    if (count($analytics) > 1000) {
        update_option('quiz_sicurezza_analytics', array_slice($analytics, -500));
    }
}

/**
 * ========== DISATTIVAZIONE PLUGIN ==========
 */
register_deactivation_hook(__FILE__, 'quiz_sicurezza_deactivation');
function quiz_sicurezza_deactivation() {
    // Rimuovi eventi schedulati
    wp_clear_scheduled_hook('quiz_sicurezza_daily_cleanup');
}

/**
 * ========== GDPR COMPLIANCE ==========
 */

/**
 * Registra dati personali per GDPR
 */
add_filter('wp_privacy_personal_data_exporters', 'quiz_sicurezza_register_exporter');
function quiz_sicurezza_register_exporter($exporters) {
    $exporters['quiz-sicurezza'] = array(
        'exporter_friendly_name' => 'Quiz Sicurezza Lavoro',
        'callback' => 'quiz_sicurezza_export_personal_data'
    );
    return $exporters;
}

function quiz_sicurezza_export_personal_data($email_address) {
    global $wpdb;
    
    $data_to_export = array();
    $table_name = $wpdb->prefix . 'quiz_sicurezza_leads';
    
    $leads = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE email = %s",
        $email_address
    ));
    
    foreach ($leads as $lead) {
        $data_to_export[] = array(
            'group_id' => 'quiz-sicurezza',
            'group_label' => 'Quiz Sicurezza Lavoro',
            'item_id' => 'lead-' . $lead->id,
            'data' => array(
                'Azienda' => $lead->company_name,
                'Email' => $lead->email,
                'Telefono' => $lead->phone,
                'Settore' => $lead->sector,
                'Data compilazione' => $lead->created_at,
                'Risultati quiz' => $lead->quiz_answers
            )
        );
    }
    
    return array(
        'data' => $data_to_export,
        'done' => true
    );
}

/**
 * Registra cancellazione dati per GDPR
 */
add_filter('wp_privacy_personal_data_erasers', 'quiz_sicurezza_register_eraser');
function quiz_sicurezza_register_eraser($erasers) {
    $erasers['quiz-sicurezza'] = array(
        'eraser_friendly_name' => 'Quiz Sicurezza Lavoro',
        'callback' => 'quiz_sicurezza_erase_personal_data'
    );
    return $erasers;
}

function quiz_sicurezza_erase_personal_data($email_address) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'quiz_sicurezza_leads';
    
    $items_removed = $wpdb->delete(
        $table_name,
        array('email' => $email_address),
        array('%s')
    );
    
    return array(
        'items_removed' => $items_removed,
        'items_retained' => false,
        'messages' => array(),
        'done' => true
    );
}

/**
 * ========== FINE CODICE ==========
 */

// Log inizializzazione
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('Quiz Sicurezza Lavoro - Functions loaded');
}
?>