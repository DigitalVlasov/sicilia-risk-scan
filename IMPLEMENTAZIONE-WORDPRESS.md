# IMPLEMENTAZIONE WORDPRESS - QUIZ SICUREZZA LAVORO

## 📋 GUIDA COMPLETA ALL'IMPLEMENTAZIONE

### PASSAGGIO 1: PREPARAZIONE FILES

1. **Scarica i file necessari:**
   - `quiz-sicurezza-wordpress.html` (file principale)
   - `quiz-sicurezza-functions.php` (codice per functions.php)
   - Questo file di documentazione

2. **Backup del sito:**
   ```bash
   # Fai sempre un backup completo prima di procedere
   wp db export backup-$(date +%Y%m%d).sql
   ```

### PASSAGGIO 2: IMPLEMENTAZIONE CODICE PHP

1. **Apri il file functions.php del tuo tema attivo:**
   ```
   /wp-content/themes/[tuo-tema]/functions.php
   ```

2. **Aggiungi tutto il contenuto di `quiz-sicurezza-functions.php` alla fine del file functions.php:**
   ```php
   // Incolla qui tutto il codice PHP dopo la chiusura ?>
   ```

3. **Salva il file e verifica che non ci siano errori:**
   - Vai nel pannello admin WordPress
   - Controlla che il sito carichi correttamente
   - Se ci sono errori, ripristina il backup

### PASSAGGIO 3: CREAZIONE PAGINA QUIZ

**Opzione A - Pagina WordPress (Consigliata):**

1. **Crea una nuova pagina:**
   - Vai su Pagine → Aggiungi nuova
   - Titolo: "Test Sicurezza Lavoro"
   - Slug: "test-sicurezza-lavoro"

2. **Inserisci il contenuto HTML:**
   - Passa alla modalità "Testo/HTML" 
   - Copia tutto il contenuto del `<body>` dal file HTML
   - Rimuovi header e footer (già presenti nel tema)

3. **Pubblica la pagina**

**Opzione B - Template Custom:**

1. **Crea file template:**
   ```
   /wp-content/themes/[tuo-tema]/page-quiz-sicurezza.php
   ```

2. **Inserisci il codice:**
   ```php
   <?php
   /*
   Template Name: Quiz Sicurezza
   */
   get_header(); ?>
   
   <!-- Inserisci qui il contenuto del body HTML -->
   
   <?php get_footer(); ?>
   ```

### PASSAGGIO 4: CONFIGURAZIONE SICUREZZA

1. **Verifica tabelle database:**
   - Le tabelle vengono create automaticamente
   - Controlla in phpMyAdmin che esistano:
     - `wp_quiz_sicurezza_leads`
     - `wp_quiz_sicurezza_rate_limit`
     - `wp_quiz_sicurezza_errors`

2. **Configura rate limiting (opzionale):**
   ```php
   // Nel functions.php, puoi modificare:
   define('QUIZ_RATE_LIMIT_REQUESTS', 20); // Aumenta se necessario
   define('QUIZ_RATE_LIMIT_PERIOD', 3600); // 1 ora
   ```

3. **Aggiungi protezione extra .htaccess:**
   ```apache
   # Aggiungi al .htaccess nella root
   <FilesMatch "quiz-sicurezza.*">
       # Rate limiting base
       <RequireAll>
           Require all granted
           # Aggiungi IP ban se necessario
       </RequireAll>
   </FilesMatch>
   ```

### PASSAGGIO 5: TEST E VERIFICA

1. **Test funzionalità di base:**
   - [ ] Il quiz si carica correttamente
   - [ ] Le domande appaiono in sequenza
   - [ ] I calcoli del rischio sono corretti
   - [ ] Il WhatsApp si apre con messaggio precompilato

2. **Test sicurezza:**
   - [ ] Rate limiting funziona (prova molte richieste rapide)
   - [ ] Nonce verification attivo
   - [ ] Input sanitization funziona
   - [ ] CSRF protection attivo

3. **Test mobile:**
   - [ ] Layout responsive corretto
   - [ ] Touch interactions funzionano
   - [ ] Performance accettabile (<3s caricamento)

4. **Test database:**
   - [ ] I lead vengono salvati correttamente
   - [ ] Email di notifica funzionano
   - [ ] Export CSV funziona

### PASSAGGIO 6: CONFIGURAZIONE AVANZATA

1. **Personalizzazione logo:**
   ```html
   <!-- Modifica nel HTML -->
   <img src="/wp-content/uploads/2025/01/tuo-logo.png" alt="Tuo Logo">
   ```

2. **Personalizzazione colori:**
   ```css
   /* Nel CSS, modifica le variabili HSL */
   :root {
     --primary: 220 100% 50%; /* Il tuo colore primario */
     --cta: 120 100% 25%;     /* Il tuo colore CTA */
   }
   ```

3. **Personalizzazione WhatsApp:**
   ```javascript
   // Nel JavaScript, modifica:
   const APP_CONFIG = {
     contact: {
       whatsapp: "390955872480" // Il tuo numero
     }
   };
   ```

### PASSAGGIO 7: ANALYTICS E MONITORING

1. **Dashboard amministratore:**
   - Vai su Strumenti → Quiz Sicurezza
   - Visualizza statistiche e leads
   - Esporta dati in CSV

2. **Monitoring errori:**
   ```php
   // Aggiungi nel wp-config.php per debug
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   
   // Controlla log in: /wp-content/debug.log
   ```

3. **Google Analytics (opzionale):**
   ```javascript
   // Aggiungi tracking eventi
   gtag('event', 'quiz_completed', {
     'risk_level': risk.level,
     'violations_count': violations.length
   });
   ```

## 🔧 TROUBLESHOOTING

### Errori Comuni e Soluzioni

**Errore: "Fatal error in functions.php"**
```
Soluzione: Controlla sintassi PHP, ripristina backup
```

**Errore: "Tabelle non create"**
```
Soluzione: Attiva/disattiva plugin o esegui manualmente:
wp eval 'quiz_sicurezza_create_tables();'
```

**Errore: "AJAX non funziona"**
```
Soluzioni:
- Verifica che wp_ajax hooks siano registrati
- Controlla console browser per errori JavaScript
- Verifica nonce e URL AJAX
```

**Errore: "Rate limiting troppo aggressivo"**
```
Soluzione: Aumenta limiti nel functions.php:
define('QUIZ_RATE_LIMIT_REQUESTS', 50);
```

**Errore: "Email non inviate"**
```
Soluzioni:
- Installa plugin SMTP (WP Mail SMTP)
- Verifica configurazione server email
- Controlla spam folder
```

### Performance Optimization

1. **Caching:**
   ```php
   // Escludi pagina quiz da cache
   // Per WP Rocket:
   add_filter('rocket_cache_reject_uri', function($urls) {
       $urls[] = '/test-sicurezza-lavoro/';
       return $urls;
   });
   ```

2. **CDN (opzionale):**
   ```html
   <!-- Carica CSS/JS da CDN se preferisci -->
   <link rel="preload" href="css/quiz.css" as="style">
   <script defer src="js/quiz.js"></script>
   ```

3. **Database optimization:**
   ```sql
   -- Esegui periodicamente per performance
   OPTIMIZE TABLE wp_quiz_sicurezza_leads;
   OPTIMIZE TABLE wp_quiz_sicurezza_rate_limit;
   ```

## 🛡️ SICUREZZA AVANZATA

### Configurazione Firewall

1. **CloudFlare (consigliato):**
   ```
   - Abilita "Under Attack Mode" se necessario
   - Configura rate limiting: 100 req/min per IP
   - Abilita WAF con regole WordPress
   ```

2. **Wordfence/Sucuri:**
   ```php
   // Escludere endpoint AJAX da alcuni controlli
   add_filter('wordfence_ls_exclude_uri', function($uris) {
       $uris[] = 'admin-ajax.php';
       return $uris;
   });
   ```

### Backup e Recovery

1. **Backup automatico:**
   ```bash
   # Cron job per backup giornaliero
   0 2 * * * wp db export backup-quiz-$(date +%Y%m%d).sql
   ```

2. **Recovery plan:**
   ```
   1. Ripristina functions.php da backup
   2. Ripristina database da backup
   3. Controlla logs per causa del problema
   4. Riapplica modifiche gradualmente
   ```

## 📊 GDPR COMPLIANCE

### Implementazione Completa

1. **Cookie consent (richiesto):**
   ```javascript
   // Aggiungi check consenso cookie prima del quiz
   if (!cookieConsentGiven()) {
       showCookieConsent();
       return;
   }
   ```

2. **Privacy Policy (aggiorna):**
   ```
   Aggiungi sezione per Quiz Sicurezza:
   - Dati raccolti (email, telefono, risposte)
   - Finalità (consulenza, marketing se consenso)
   - Durata conservazione (2 anni)
   - Diritti utente (accesso, cancellazione, portabilità)
   ```

3. **Data retention:**
   ```php
   // Cancellazione automatica dopo 2 anni
   add_action('quiz_sicurezza_daily_cleanup', function() {
       global $wpdb;
       $wpdb->delete(
           $wpdb->prefix . 'quiz_sicurezza_leads',
           array('created_at' => array('<', date('Y-m-d', strtotime('-2 years')))),
           array('%s')
       );
   });
   ```

## 🚀 OTTIMIZZAZIONI POST-LANCIO

### A/B Testing

1. **Testa variazioni:**
   - Colori CTA
   - Testi delle domande
   - Messaggi WhatsApp
   - Layout mobile

2. **Metriche da monitorare:**
   - Tasso completamento quiz
   - Conversione lead
   - Tempo speso per domanda
   - Abbandoni per fase

### Miglioramenti UX

1. **Salvataggio progresso:**
   ```javascript
   // Salva risposte in localStorage
   localStorage.setItem('quiz_progress', JSON.stringify(answers));
   ```

2. **Loading animations:**
   ```css
   /* Migliora feedback visivo */
   .loading-skeleton { /* animazione caricamento */ }
   ```

3. **Validazione real-time:**
   ```javascript
   // Valida input mentre l'utente digita
   function validateEmailRealTime(email) { /* ... */ }
   ```

## 📞 SUPPORTO E MANUTENZIONE

### Monitoraggio Continuo

1. **Controlla settimanalmente:**
   - [ ] Funzionamento quiz
   - [ ] Performance database  
   - [ ] Log errori
   - [ ] Statistiche conversioni

2. **Aggiornamenti mensili:**
   - [ ] Backup completo
   - [ ] Pulizia database
   - [ ] Aggiornamento domande se necessario
   - [ ] Review sicurezza

3. **Supporto utenti:**
   - Monitor email automatiche
   - Tempo risposta WhatsApp <2h
   - FAQ aggiornate

---

## ✅ CHECKLIST FINALE

- [ ] File functions.php aggiornato
- [ ] Pagina quiz creata e funzionante
- [ ] Database tabelle create correttamente
- [ ] Test completo su desktop e mobile
- [ ] Rate limiting configurato
- [ ] GDPR compliance verificata
- [ ] Email notifications attive
- [ ] Dashboard admin accessibile
- [ ] Backup sistema creato
- [ ] Performance testing completato

**🎉 Il tuo Quiz Sicurezza Lavoro è pronto per l'uso!**

---

*Documentazione creata per implementazione WordPress vanilla del Quiz Sicurezza Lavoro - Versione 2025*