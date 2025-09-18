# 🚀 ISTRUZIONI PER IL DEPLOYMENT
## Quiz Sicurezza Aziendale - Spazio Impresa

---

## 📁 CONTENUTO DELLA CARTELLA

```
build-produzione/
├── index.html                    # File principale del quiz
├── assets/
│   ├── index-optimized.js        # JavaScript ottimizzato
│   └── spazio-impresa-logo.png   # Logo aziendale
├── wordpress/                    # File per integrazione WordPress (OPZIONALE)
│   ├── quiz-sicurezza-functions.php
│   └── quiz-sicurezza-wordpress.html
└── ISTRUZIONI-DEPLOYMENT.md     # Questo file
```

---

## ⚡ DEPLOYMENT VELOCE (Raccomandato)

### 1️⃣ **Carica i File**
- Copia **tutto il contenuto** della cartella `build-produzione/` sul server web
- **NON** caricare la cartella `build-produzione/` stessa, ma il suo contenuto
- Il file `index.html` deve essere nella root del dominio/sottodominio

### 2️⃣ **Verifica Upload**
Assicurati che la struttura sul server sia:
```
tuodominio.com/
├── index.html
├── assets/
│   ├── index-optimized.js
│   └── spazio-impresa-logo.png
└── wordpress/ (opzionale)
```

### 3️⃣ **Test**
- Visita il sito: `https://tuodominio.com`
- Verifica che il quiz si carichi correttamente
- Testa completando un quiz di prova

---

## 🎯 CONFIGURAZIONE DOMINIO

### **Dominio Principale** (es. `spazio-impresa.com`)
✅ Carica i file nella root del dominio

### **Sottodominio** (es. `quiz.spazio-impresa.com`)
✅ Crea il sottodominio nel pannello hosting
✅ Carica i file nella cartella del sottodominio

### **Sottocartella** (es. `spazio-impresa.com/quiz`)
⚠️ Richiede modifica del file `index.html`:
- Cambia `<link rel="canonical" href="/" />` in `<link rel="canonical" href="/quiz/" />`

---

## 🔧 INTEGRAZIONE WORDPRESS (Opzionale)

Se vuoi integrare il quiz in WordPress:

### Metodo 1: Embed in Pagina
```html
<iframe src="https://quiz.spazio-impresa.com" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

### Metodo 2: Plugin Personalizzato
1. Carica `wordpress/quiz-sicurezza-functions.php` nella cartella del tema
2. Usa lo shortcode `[quiz-sicurezza]` in qualsiasi pagina

---

## 📊 PERSONALIZZAZIONE CONTATTI

**Modifica i contatti** nel file `assets/index-optimized.js`:

Cerca queste righe (circa linea 250):
```javascript
const whatsappMessage = `Ciao! Ho completato il Quiz...`;
// Cambia il numero WhatsApp qui: 393123456789

// E cerca anche:
<a href="tel:+393123456789" class="btn-outline mr-4">
// Cambia il numero telefono qui
```

**Sostituisci**:
- `393123456789` con il numero WhatsApp reale
- `info@spazio-impresa.it` con l'email reale
- `P.IVA 00000000000` con la partita IVA reale

---

## 📈 TRACKING E ANALYTICS

### Google Analytics
Aggiungi questo codice nel `<head>` di `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Facebook Pixel
```html
<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

---

## ✅ CHECKLIST FINALE

- [ ] File caricati correttamente sul server
- [ ] Quiz si carica senza errori
- [ ] Logo Spazio Impresa visibile
- [ ] Pulsanti WhatsApp e telefono funzionanti
- [ ] Test completamento quiz
- [ ] Verifica responsive (mobile/desktop)
- [ ] Domini/sottodomini configurati
- [ ] Contatti personalizzati
- [ ] Analytics configurato (opzionale)

---

## 🆘 RISOLUZIONE PROBLEMI

### **Quiz non si carica**
- Verifica che `index.html` sia nella root
- Controlla che la cartella `assets/` sia presente
- Verifica permessi file (644 per file, 755 per cartelle)

### **Immagini mancanti**
- Controlla che `assets/spazio-impresa-logo.png` sia presente
- Verifica il path nel codice

### **Errori JavaScript**
- Apri console browser (F12) per vedere errori
- Verifica che `assets/index-optimized.js` sia accessibile

---

## 📞 SUPPORTO TECNICO

Per problemi tecnici, contatta:
- **Email**: info@spazio-impresa.it
- **WhatsApp**: +39 312 345 6789

**Dimensioni totale progetto**: ~2-3 MB
**Compatibilità**: Tutti i browser moderni
**Hosting richiesto**: Qualsiasi hosting con supporto HTML/CSS/JS

---

## 🎉 CONGRATULAZIONI!

Il tuo Quiz Sicurezza Aziendale è pronto per raccogliere lead e aiutare le PMI a valutare i loro rischi di conformità!

**Ricorda**: Questo quiz è ottimizzato per conversioni e lead generation. Monitora i risultati e ottimizza i contatti in base ai feedback dei clienti.