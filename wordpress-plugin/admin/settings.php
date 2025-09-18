<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Handle settings save
if (isset($_POST['save_settings']) && wp_verify_nonce($_POST['settings_nonce'], 'quiz_sicurezza_settings')) {
    update_option('quiz_sicurezza_phone', sanitize_text_field($_POST['phone']));
    update_option('quiz_sicurezza_whatsapp', sanitize_text_field($_POST['whatsapp']));
    update_option('quiz_sicurezza_company_name', sanitize_text_field($_POST['company_name']));
    update_option('quiz_sicurezza_primary_color', sanitize_hex_color($_POST['primary_color']));
    update_option('quiz_sicurezza_logo_url', esc_url_raw($_POST['logo_url']));
    update_option('quiz_sicurezza_enable_analytics', isset($_POST['enable_analytics']) ? 1 : 0);
    
    echo '<div class="notice notice-success"><p>Impostazioni salvate con successo!</p></div>';
}

// Get current settings
$phone = get_option('quiz_sicurezza_phone', '0955872480');
$whatsapp = get_option('quiz_sicurezza_whatsapp', '390955872480');
$company_name = get_option('quiz_sicurezza_company_name', 'Spazio Impresa');
$primary_color = get_option('quiz_sicurezza_primary_color', '#dc2626');
$logo_url = get_option('quiz_sicurezza_logo_url', '');
$enable_analytics = get_option('quiz_sicurezza_enable_analytics', 1);
?>

<div class="wrap">
    <h1>Impostazioni Quiz Sicurezza</h1>
    
    <form method="post" action="">
        <?php wp_nonce_field('quiz_sicurezza_settings', 'settings_nonce'); ?>
        
        <table class="form-table" role="presentation">
            <tbody>
                <!-- Contact Settings -->
                <tr>
                    <th scope="row" colspan="2">
                        <h2>Informazioni Contatto</h2>
                    </th>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="company_name">Nome Azienda</label>
                    </th>
                    <td>
                        <input name="company_name" type="text" id="company_name" 
                               value="<?php echo esc_attr($company_name); ?>" class="regular-text" />
                        <p class="description">Nome della tua azienda visualizzato nel quiz</p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="phone">Numero Telefono</label>
                    </th>
                    <td>
                        <input name="phone" type="text" id="phone" 
                               value="<?php echo esc_attr($phone); ?>" class="regular-text" />
                        <p class="description">Numero di telefono per i contatti (es: 0955872480)</p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="whatsapp">WhatsApp</label>
                    </th>
                    <td>
                        <input name="whatsapp" type="text" id="whatsapp" 
                               value="<?php echo esc_attr($whatsapp); ?>" class="regular-text" />
                        <p class="description">Numero WhatsApp con prefisso (es: 390955872480)</p>
                    </td>
                </tr>
                
                <!-- Visual Settings -->
                <tr>
                    <th scope="row" colspan="2">
                        <h2>Personalizzazione Visuale</h2>
                    </th>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="primary_color">Colore Primario</label>
                    </th>
                    <td>
                        <input name="primary_color" type="color" id="primary_color" 
                               value="<?php echo esc_attr($primary_color); ?>" />
                        <p class="description">Colore principale del quiz</p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="logo_url">URL Logo</label>
                    </th>
                    <td>
                        <input name="logo_url" type="url" id="logo_url" 
                               value="<?php echo esc_attr($logo_url); ?>" class="regular-text" />
                        <p class="description">URL del logo da mostrare nel quiz (opzionale)</p>
                    </td>
                </tr>
                
                <!-- Analytics Settings -->
                <tr>
                    <th scope="row" colspan="2">
                        <h2>Analytics e Tracking</h2>
                    </th>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="enable_analytics">Abilita Analytics</label>
                    </th>
                    <td>
                        <fieldset>
                            <label for="enable_analytics">
                                <input name="enable_analytics" type="checkbox" id="enable_analytics" 
                                       value="1" <?php checked($enable_analytics, 1); ?> />
                                Registra e analizza i risultati del quiz
                            </label>
                            <p class="description">Disabilita se non vuoi salvare i dati dei quiz nel database</p>
                        </fieldset>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <!-- Shortcode Info -->
        <div style="background: #f1f1f1; padding: 20px; margin: 20px 0; border-left: 4px solid #0073aa;">
            <h3>Come usare il Quiz</h3>
            <p><strong>Shortcode base:</strong></p>
            <code>[quiz_sicurezza]</code>
            
            <p><strong>Shortcode con opzioni:</strong></p>
            <code>[quiz_sicurezza width="100%" height="600px"]</code>
            
            <p><strong>Parametri disponibili:</strong></p>
            <ul>
                <li><code>width</code> - Larghezza del quiz (default: 100%)</li>
                <li><code>height</code> - Altezza del quiz (default: auto)</li>
            </ul>
            
            <p><strong>Per inserire il quiz:</strong></p>
            <ol>
                <li>Crea una nuova pagina o post</li>
                <li>Inserisci lo shortcode <code>[quiz_sicurezza]</code> nel contenuto</li>
                <li>Pubblica la pagina</li>
            </ol>
        </div>
        
        <!-- Technical Info -->
        <div style="background: #fff; border: 1px solid #ccd0d4; padding: 20px; margin: 20px 0;">
            <h3>Informazioni Tecniche</h3>
            <table class="widefat">
                <tr>
                    <td><strong>Versione Plugin:</strong></td>
                    <td><?php echo QUIZ_SICUREZZA_VERSION; ?></td>
                </tr>
                <tr>
                    <td><strong>Database Tabella:</strong></td>
                    <td><?php global $wpdb; echo $wpdb->prefix . 'quiz_sicurezza_results'; ?></td>
                </tr>
                <tr>
                    <td><strong>Totale Submissions:</strong></td>
                    <td>
                        <?php 
                        global $wpdb;
                        $table_name = $wpdb->prefix . 'quiz_sicurezza_results';
                        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
                        echo $total;
                        ?>
                    </td>
                </tr>
                <tr>
                    <td><strong>PHP Version:</strong></td>
                    <td><?php echo PHP_VERSION; ?></td>
                </tr>
                <tr>
                    <td><strong>WordPress Version:</strong></td>
                    <td><?php echo get_bloginfo('version'); ?></td>
                </tr>
            </table>
        </div>
        
        <?php submit_button('Salva Impostazioni', 'primary', 'save_settings'); ?>
    </form>
</div>

<style>
.form-table h2 {
    margin: 0;
    padding: 0;
    font-size: 1.1em;
    color: #23282d;
}

.form-table th[colspan="2"] {
    padding-top: 25px;
    padding-bottom: 5px;
}

code {
    background: #f1f1f1;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: Consolas, Monaco, monospace;
}
</style>