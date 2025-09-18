<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get statistics from database
global $wpdb;
$table_name = $wpdb->prefix . 'quiz_sicurezza_results';

$total_submissions = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
$today_submissions = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM $table_name WHERE DATE(submission_time) = %s",
    date('Y-m-d')
));
$week_submissions = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM $table_name WHERE submission_time >= %s",
    date('Y-m-d', strtotime('-7 days'))
));

// Get risk level distribution
$risk_distribution = $wpdb->get_results(
    "SELECT risk_level, COUNT(*) as count FROM $table_name GROUP BY risk_level"
);

// Get sector distribution
$sector_distribution = $wpdb->get_results(
    "SELECT sector, COUNT(*) as count FROM $table_name GROUP BY sector ORDER BY count DESC LIMIT 5"
);

// Get recent submissions
$recent_submissions = $wpdb->get_results(
    "SELECT * FROM $table_name ORDER BY submission_time DESC LIMIT 10"
);
?>

<div class="wrap">
    <h1>Dashboard Quiz Sicurezza sul Lavoro</h1>
    
    <div class="dashboard-widgets-wrap">
        <!-- Statistics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="postbox">
                <div class="postbox-header"><h2 class="hndle">Totale Submissions</h2></div>
                <div class="inside">
                    <p style="font-size: 2em; margin: 0; color: #2271b1;"><?php echo esc_html($total_submissions); ?></p>
                    <p style="margin: 5px 0 0 0; color: #666;">Dall'inizio</p>
                </div>
            </div>
            
            <div class="postbox">
                <div class="postbox-header"><h2 class="hndle">Oggi</h2></div>
                <div class="inside">
                    <p style="font-size: 2em; margin: 0; color: #00a32a;"><?php echo esc_html($today_submissions); ?></p>
                    <p style="margin: 5px 0 0 0; color: #666;">Quiz completati</p>
                </div>
            </div>
            
            <div class="postbox">
                <div class="postbox-header"><h2 class="hndle">Questa Settimana</h2></div>
                <div class="inside">
                    <p style="font-size: 2em; margin: 0; color: #d63638;"><?php echo esc_html($week_submissions); ?></p>
                    <p style="margin: 5px 0 0 0; color: #666;">Nuovi leads</p>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <!-- Risk Level Distribution -->
            <div class="postbox">
                <div class="postbox-header"><h2 class="hndle">Distribuzione Livello di Rischio</h2></div>
                <div class="inside">
                    <?php if (!empty($risk_distribution)): ?>
                        <table class="widefat">
                            <thead>
                                <tr>
                                    <th>Livello Rischio</th>
                                    <th>Quantità</th>
                                    <th>Percentuale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($risk_distribution as $risk): 
                                    $percentage = $total_submissions > 0 ? round(($risk->count / $total_submissions) * 100, 1) : 0;
                                ?>
                                <tr>
                                    <td><?php echo esc_html($risk->risk_level); ?></td>
                                    <td><?php echo esc_html($risk->count); ?></td>
                                    <td><?php echo esc_html($percentage); ?>%</td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p>Nessun dato disponibile</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Sector Distribution -->
            <div class="postbox">
                <div class="postbox-header"><h2 class="hndle">Settori Principali</h2></div>
                <div class="inside">
                    <?php if (!empty($sector_distribution)): ?>
                        <table class="widefat">
                            <thead>
                                <tr>
                                    <th>Settore</th>
                                    <th>Quantità</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($sector_distribution as $sector): ?>
                                <tr>
                                    <td><?php echo esc_html(ucfirst($sector->sector)); ?></td>
                                    <td><?php echo esc_html($sector->count); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p>Nessun dato disponibile</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Recent Submissions -->
        <div class="postbox">
            <div class="postbox-header">
                <h2 class="hndle">Ultime Submissions</h2>
            </div>
            <div class="inside">
                <?php if (!empty($recent_submissions)): ?>
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Settore</th>
                                <th>Gestione</th>
                                <th>Dipendenti</th>
                                <th>Rischio</th>
                                <th>Score</th>
                                <th>Contatto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_submissions as $submission): ?>
                            <tr>
                                <td><?php echo esc_html(date('d/m/Y H:i', strtotime($submission->submission_time))); ?></td>
                                <td><?php echo esc_html(ucfirst($submission->sector)); ?></td>
                                <td><?php echo esc_html($submission->management_type); ?></td>
                                <td><?php echo esc_html($submission->employees); ?></td>
                                <td>
                                    <span style="padding: 2px 8px; border-radius: 3px; font-size: 12px; 
                                        <?php 
                                        $color = $submission->risk_level === 'Alto' ? 'background: #d63638; color: white;' : 
                                                ($submission->risk_level === 'Medio' ? 'background: #dba617; color: white;' : 'background: #00a32a; color: white;');
                                        echo $color;
                                        ?>">
                                        <?php echo esc_html($submission->risk_level); ?>
                                    </span>
                                </td>
                                <td><?php echo esc_html($submission->risk_score); ?>/100</td>
                                <td>
                                    <?php if ($submission->contact_phone): ?>
                                        <a href="tel:<?php echo esc_attr($submission->contact_phone); ?>"><?php echo esc_html($submission->contact_phone); ?></a>
                                    <?php endif; ?>
                                    <?php if ($submission->contact_email): ?>
                                        <br><a href="mailto:<?php echo esc_attr($submission->contact_email); ?>"><?php echo esc_html($submission->contact_email); ?></a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <p><a href="<?php echo admin_url('admin.php?page=quiz-sicurezza-results'); ?>" class="button">Vedi tutti i risultati</a></p>
                <?php else: ?>
                    <p>Nessuna submission ancora registrata.</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="postbox">
            <div class="postbox-header"><h2 class="hndle">Azioni Rapide</h2></div>
            <div class="inside">
                <p><strong>Shortcode per inserire il quiz:</strong></p>
                <code style="background: #f1f1f1; padding: 10px; display: block; margin: 10px 0;">[quiz_sicurezza]</code>
                
                <p><strong>Per inserire il quiz in una pagina:</strong></p>
                <ol>
                    <li>Vai su Pagine → Aggiungi nuova</li>
                    <li>Inserisci il titolo (es. "Test Sicurezza")</li>
                    <li>Nel contenuto inserisci: <code>[quiz_sicurezza]</code></li>
                    <li>Pubblica la pagina</li>
                </ol>
                
                <p>
                    <a href="<?php echo admin_url('post-new.php?post_type=page'); ?>" class="button button-primary">Crea pagina quiz</a>
                    <a href="<?php echo admin_url('admin.php?page=quiz-sicurezza-results'); ?>" class="button">Gestisci risultati</a>
                    <a href="<?php echo admin_url('admin.php?page=quiz-sicurezza-settings'); ?>" class="button">Impostazioni</a>
                </p>
            </div>
        </div>
    </div>
</div>