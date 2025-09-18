<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Handle export
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    global $wpdb;
    $table_name = $wpdb->prefix . 'quiz_sicurezza_results';
    
    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY submission_time DESC");
    
    $filename = 'quiz-sicurezza-results-' . date('Y-m-d') . '.csv';
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    
    $output = fopen('php://output', 'w');
    
    // CSV Headers
    fputcsv($output, array(
        'ID', 'Data Submission', 'IP', 'Settore', 'Tipo Gestione', 
        'Dipendenti', 'Livello Rischio', 'Score Rischio', 'Violazioni', 
        'Telefono', 'Email'
    ));
    
    foreach ($results as $result) {
        fputcsv($output, array(
            $result->id,
            $result->submission_time,
            $result->user_ip,
            $result->sector,
            $result->management_type,
            $result->employees,
            $result->risk_level,
            $result->risk_score,
            $result->violations,
            $result->contact_phone,
            $result->contact_email
        ));
    }
    
    fclose($output);
    exit;
}

// Get results with pagination
global $wpdb;
$table_name = $wpdb->prefix . 'quiz_sicurezza_results';

$per_page = 20;
$current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$offset = ($current_page - 1) * $per_page;

// Filters
$where_clause = '';
$where_params = array();

if (isset($_GET['sector']) && !empty($_GET['sector'])) {
    $where_clause .= " AND sector = %s";
    $where_params[] = sanitize_text_field($_GET['sector']);
}

if (isset($_GET['risk_level']) && !empty($_GET['risk_level'])) {
    $where_clause .= " AND risk_level = %s";
    $where_params[] = sanitize_text_field($_GET['risk_level']);
}

if (isset($_GET['date_from']) && !empty($_GET['date_from'])) {
    $where_clause .= " AND DATE(submission_time) >= %s";
    $where_params[] = sanitize_text_field($_GET['date_from']);
}

if (isset($_GET['date_to']) && !empty($_GET['date_to'])) {
    $where_clause .= " AND DATE(submission_time) <= %s";
    $where_params[] = sanitize_text_field($_GET['date_to']);
}

// Count total results
$count_query = "SELECT COUNT(*) FROM $table_name WHERE 1=1 $where_clause";
if (!empty($where_params)) {
    $total_results = $wpdb->get_var($wpdb->prepare($count_query, $where_params));
} else {
    $total_results = $wpdb->get_var($count_query);
}

// Get results
$results_query = "SELECT * FROM $table_name WHERE 1=1 $where_clause ORDER BY submission_time DESC LIMIT %d OFFSET %d";
$query_params = array_merge($where_params, array($per_page, $offset));

if (!empty($query_params)) {
    $results = $wpdb->get_results($wpdb->prepare($results_query, $query_params));
} else {
    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY submission_time DESC LIMIT $per_page OFFSET $offset");
}

// Get filter options
$sectors = $wpdb->get_col("SELECT DISTINCT sector FROM $table_name ORDER BY sector");
$risk_levels = $wpdb->get_col("SELECT DISTINCT risk_level FROM $table_name ORDER BY risk_level");

$total_pages = ceil($total_results / $per_page);
?>

<div class="wrap">
    <h1>
        Risultati Quiz Sicurezza 
        <a href="<?php echo add_query_arg('export', 'csv'); ?>" class="page-title-action">
            Esporta CSV
        </a>
    </h1>

    <!-- Filters -->
    <div class="tablenav top">
        <form method="get" action="">
            <input type="hidden" name="page" value="quiz-sicurezza-results">
            
            <div style="display: flex; gap: 10px; align-items: end; margin-bottom: 20px; flex-wrap: wrap;">
                <div>
                    <label for="sector">Settore:</label><br>
                    <select name="sector" id="sector">
                        <option value="">Tutti i settori</option>
                        <?php foreach ($sectors as $sector): ?>
                            <option value="<?php echo esc_attr($sector); ?>" <?php selected($_GET['sector'] ?? '', $sector); ?>>
                                <?php echo esc_html(ucfirst($sector)); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div>
                    <label for="risk_level">Livello Rischio:</label><br>
                    <select name="risk_level" id="risk_level">
                        <option value="">Tutti i livelli</option>
                        <?php foreach ($risk_levels as $level): ?>
                            <option value="<?php echo esc_attr($level); ?>" <?php selected($_GET['risk_level'] ?? '', $level); ?>>
                                <?php echo esc_html($level); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div>
                    <label for="date_from">Da:</label><br>
                    <input type="date" name="date_from" id="date_from" value="<?php echo esc_attr($_GET['date_from'] ?? ''); ?>">
                </div>
                
                <div>
                    <label for="date_to">A:</label><br>
                    <input type="date" name="date_to" id="date_to" value="<?php echo esc_attr($_GET['date_to'] ?? ''); ?>">
                </div>
                
                <div>
                    <input type="submit" class="button" value="Filtra">
                    <a href="<?php echo admin_url('admin.php?page=quiz-sicurezza-results'); ?>" class="button">Reset</a>
                </div>
            </div>
        </form>
    </div>

    <!-- Results Table -->
    <?php if (!empty($results)): ?>
        <p>Mostrando <?php echo count($results); ?> di <?php echo $total_results; ?> risultati</p>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Settore</th>
                    <th>Gestione</th>
                    <th>Dipendenti</th>
                    <th>Rischio</th>
                    <th>Score</th>
                    <th>Contatti</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($results as $result): ?>
                <tr>
                    <td><?php echo esc_html($result->id); ?></td>
                    <td><?php echo esc_html(date('d/m/Y H:i', strtotime($result->submission_time))); ?></td>
                    <td><?php echo esc_html(ucfirst($result->sector)); ?></td>
                    <td><?php echo esc_html($result->management_type); ?></td>
                    <td><?php echo esc_html($result->employees); ?></td>
                    <td>
                        <span style="padding: 2px 8px; border-radius: 3px; font-size: 12px; 
                            <?php 
                            $color = $result->risk_level === 'Alto' ? 'background: #d63638; color: white;' : 
                                    ($result->risk_level === 'Medio' ? 'background: #dba617; color: white;' : 'background: #00a32a; color: white;');
                            echo $color;
                            ?>">
                            <?php echo esc_html($result->risk_level); ?>
                        </span>
                    </td>
                    <td><?php echo esc_html($result->risk_score); ?>/100</td>
                    <td>
                        <?php if ($result->contact_phone): ?>
                            <div>📞 <a href="tel:<?php echo esc_attr($result->contact_phone); ?>"><?php echo esc_html($result->contact_phone); ?></a></div>
                        <?php endif; ?>
                        <?php if ($result->contact_email): ?>
                            <div>✉️ <a href="mailto:<?php echo esc_attr($result->contact_email); ?>"><?php echo esc_html($result->contact_email); ?></a></div>
                        <?php endif; ?>
                    </td>
                    <td>
                        <button type="button" class="button button-small" onclick="showDetails(<?php echo esc_attr($result->id); ?>)">
                            Dettagli
                        </button>
                    </td>
                </tr>
                
                <!-- Hidden row for details -->
                <tr id="details-<?php echo $result->id; ?>" style="display: none;">
                    <td colspan="9">
                        <div style="background: #f9f9f9; padding: 15px; margin: 10px 0;">
                            <strong>IP:</strong> <?php echo esc_html($result->user_ip); ?><br>
                            <strong>Violazioni:</strong> <?php echo esc_html($result->violations ?: 'Nessuna'); ?><br>
                            <strong>Risposte complete:</strong><br>
                            <textarea readonly style="width: 100%; height: 100px;"><?php echo esc_textarea($result->answers); ?></textarea>
                        </div>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- Pagination -->
        <?php if ($total_pages > 1): ?>
            <div class="tablenav bottom">
                <div class="tablenav-pages">
                    <span class="displaying-num"><?php echo $total_results; ?> elementi</span>
                    
                    <?php
                    $base_url = remove_query_arg('paged');
                    
                    if ($current_page > 1): ?>
                        <a class="prev-page button" href="<?php echo add_query_arg('paged', $current_page - 1, $base_url); ?>">‹</a>
                    <?php endif; ?>
                    
                    <span class="paging-input">
                        <label for="current-page-selector" class="screen-reader-text">Pagina corrente</label>
                        <input class="current-page" id="current-page-selector" type="text" 
                               name="paged" value="<?php echo $current_page; ?>" size="2" aria-describedby="table-paging">
                        <span class="tablenav-paging-text"> di <span class="total-pages"><?php echo $total_pages; ?></span></span>
                    </span>
                    
                    <?php if ($current_page < $total_pages): ?>
                        <a class="next-page button" href="<?php echo add_query_arg('paged', $current_page + 1, $base_url); ?>">›</a>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
        
    <?php else: ?>
        <p>Nessun risultato trovato con i filtri selezionati.</p>
    <?php endif; ?>
</div>

<script>
function showDetails(id) {
    const detailsRow = document.getElementById('details-' + id);
    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
    } else {
        detailsRow.style.display = 'none';
    }
}
</script>