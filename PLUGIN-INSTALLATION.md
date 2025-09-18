# 🚀 Guida Installazione Plugin WordPress "Quiz Sicurezza sul Lavoro"

## 📋 Panoramica

Il **Plugin Quiz Sicurezza sul Lavoro** ti permette di integrare facilmente il quiz interattivo nel tuo sito WordPress. Una volta installato, tutti gli algoritmi, le logiche condizionali e i sistemi di scoring rimangono **identici al 100%** alla versione React originale.

---

## 🎯 Cosa Ottieni

✅ **Quiz completo** con tutte le funzionalità originali  
✅ **Dashboard admin** per gestire risultati e statistiche  
✅ **Export CSV** dei lead generati  
✅ **Personalizzazione** colori, logo e contatti  
✅ **Shortcode semplice** `[quiz_sicurezza]` per inserimento rapido  
✅ **Compatibilità** con tutti i temi WordPress  

---

## 📦 Contenuto del Pacchetto

```
quiz-sicurezza-wordpress/
├── quiz-sicurezza.php          # Plugin principale
├── admin/
│   ├── dashboard.php           # Dashboard statistiche
│   ├── results.php             # Gestione risultati
│   └── settings.php            # Impostazioni
├── assets/
│   ├── quiz-app.js             # App React compilata
│   └── quiz-app.css            # Stili CSS
├── readme.txt                  # Documentazione WordPress
└── INSTALLATION.md             # Questa guida
```

---

## ⚡ Installazione Rapida (2 minuti)

### Passo 1: Scarica e Carica
1. Scarica il file `quiz-sicurezza.zip`
2. Accedi al tuo WordPress Admin
3. Vai su **Plugin** → **Aggiungi nuovo**
4. Clicca **Carica plugin**
5. Seleziona il file ZIP e clicca **Installa ora**

### Passo 2: Attiva
1. Clicca **Attiva plugin**
2. Nel menu laterale apparirà **"Quiz Sicurezza"**

### Passo 3: Configura (opzionale)
1. Vai su **Quiz Sicurezza** → **Impostazioni**
2. Inserisci i tuoi dati di contatto
3. Personalizza colori e logo se desiderato
4. Clicca **Salva Impostazioni**

### Passo 4: Inserisci il Quiz
1. Crea una nuova **Pagina** (o modifica esistente)
2. Nel contenuto inserisci: `[quiz_sicurezza]`
3. **Pubblica** la pagina

🎉 **FATTO!** Il tuo quiz è online e funzionante.

---

## 🛠️ Shortcode e Parametri

### Shortcode Base
```
[quiz_sicurezza]
```

### Shortcode con Opzioni
```
[quiz_sicurezza width="100%" height="600px"]
```

### Parametri Disponibili
- `width`: Larghezza del quiz (default: 100%)
- `height`: Altezza del quiz (default: auto)

---

## 📊 Dashboard Admin

Una volta installato, avrai accesso a:

### 🏠 Dashboard Principale
- **Statistiche in tempo reale** (submissions oggi, settimana, totali)
- **Distribuzione livelli di rischio**
- **Settori più attivi**
- **Ultime submissions** con contatti

### 📋 Gestione Risultati
- **Visualizzazione completa** di tutti i quiz completati
- **Filtri avanzati** per data, settore, livello di rischio
- **Export CSV** per analisi esterne
- **Dettagli completi** di ogni submission

### ⚙️ Impostazioni
- **Dati di contatto** (telefono, WhatsApp)
- **Personalizzazione visuale** (colori, logo)
- **Analytics** (abilita/disabilita tracciamento)

---

## 📱 Esempi di Utilizzo

### Pagina Dedicata
```html
<!-- Contenuto pagina "Test Sicurezza" -->
<h1>Valuta la Sicurezza della Tua Azienda</h1>
<p>Completa il nostro test gratuito basato su D.Lgs. 81/08</p>

[quiz_sicurezza]

<p>Riceverai un'analisi dettagliata e consigli personalizzati.</p>
```

### Sezione in Homepage
```html
<!-- Sezione nella homepage -->
<div class="sicurezza-section">
    <h2>Quanto è sicura la tua azienda?</h2>
    [quiz_sicurezza width="100%" height="500px"]
</div>
```

### Popup o Modal
```html
<!-- All'interno di un popup -->
[quiz_sicurezza width="90%" height="400px"]
```

---

## 🔧 Risoluzione Problemi

### Quiz Non Appare
- **Controlla** che il plugin sia attivato
- **Verifica** che lo shortcode sia scritto correttamente: `[quiz_sicurezza]`
- **Testa** su una pagina pulita senza altri plugin

### Errori di Stile
- Il quiz usa stili isolati, ma alcuni temi potrebbero interferire
- Vai su **Impostazioni** → **Colore Primario** per personalizzare

### Problemi di Performance
- Il quiz è ottimizzato, ma su hosting condivisi molto lenti potrebbero esserci ritardi nel caricamento iniziale

### Database Non Salva
- **Controlla** i permessi del database WordPress
- **Verifica** che non ci siano plugin di sicurezza che bloccano le richieste AJAX

---

## 📈 Monitoraggio e Analytics

### Metriche Disponibili
- **Conversion rate**: Quanti iniziano vs completano
- **Segmentazione settori**: Quali settori convertono di più
- **Livelli di rischio**: Distribuzione dei risultati
- **Trend temporali**: Andamento submissions nel tempo

### Export Dati
1. Vai su **Quiz Sicurezza** → **Risultati**
2. Applica filtri se necessario
3. Clicca **Esporta CSV**
4. I dati includono: data, settore, rischio, contatti, risposte complete

---

## 🛡️ Sicurezza e Privacy

### Dati Salvati
- **Risposte del quiz** (per statistiche)
- **Livello di rischio calcolato**
- **Settore di appartenenza**  
- **Contatti forniti** (telefono/email opzionali)
- **IP address** (per identificare visite uniche)

### Conformità GDPR
- I dati rimangono sul **TUO server WordPress**
- Nessun invio a servizi esterni
- **Export** e **cancellazione** dati su richiesta
- **Anonimizzazione IP** disponibile

### Sicurezza Tecnica
- **Nonce verification** per tutte le richieste AJAX
- **Sanitizzazione** di tutti gli input utente
- **Escape** di tutti gli output
- **Prepared statements** per query database

---

## 📞 Supporto e Personalizzazioni

### Supporto Incluso
- ✅ Installazione e configurazione base
- ✅ Risoluzione problemi tecnici comuni
- ✅ Aggiornamenti di sicurezza

### Personalizzazioni Extra (su richiesta)
- 🔧 Domande quiz personalizzate
- 🎨 Design completamente custom
- 📊 Integrazioni CRM (HubSpot, Salesforce, etc.)
- 📧 Email automation
- 📱 App mobile dedicata

### Contatti
- **Telefono**: 095 587 2480
- **WhatsApp**: +39 095 587 2480  
- **Email**: info@spazioimpresamatera.it

---

## ✅ Checklist Post-Installazione

- [ ] Plugin attivato correttamente
- [ ] Database tabella creata (controlla in **Impostazioni** → **Info Tecniche**)
- [ ] Shortcode inserito in una pagina di test
- [ ] Quiz funzionante e responsive
- [ ] Dati di contatto configurati
- [ ] Prima submission di test completata
- [ ] Dashboard mostra i dati correttamente
- [ ] Export CSV funzionante

---

## 🚀 Prossimi Passi

1. **Testa il quiz** completamente almeno 2-3 volte
2. **Personalizza** colori e contatti nelle impostazioni
3. **Crea una pagina dedicata** con contenuto introduttivo
4. **Promuovi** il quiz sui tuoi canali (social, newsletter, etc.)
5. **Monitora** i risultati dal dashboard admin
6. **Esporta** i lead regolarmente per il follow-up

---

**🎯 Il tuo Quiz Sicurezza è pronto per generare lead qualificati!**

*Per qualsiasi domanda o supporto, non esitare a contattarci.*