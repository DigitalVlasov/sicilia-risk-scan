# 🏗️ Istruzioni per Compilare il Plugin WordPress

## 📋 Panoramica

Queste istruzioni ti guidano nella compilazione del progetto React per creare il plugin WordPress completo. Il processo mantiene **al 100%** tutte le logiche algoritmiche originali.

---

## 🛠️ Prerequisiti

- ✅ Node.js installato (versione 16+)
- ✅ NPM o Yarn
- ✅ Progetto React funzionante
- ✅ Accesso al terminale/command line

---

## 🚀 Processo di Compilazione

### Passo 1: Preparazione del Progetto React

```bash
# Naviga nella directory del progetto
cd /path/to/your/react-project

# Installa le dipendenze (se non già fatto)
npm install

# Verifica che il progetto funzioni
npm run dev
```

### Passo 2: Modifica per WordPress Integration

Prima della compilazione, aggiungi questo codice al tuo `src/main.tsx` o `src/index.tsx`:

```typescript
// WordPress Integration Code
declare global {
  interface Window {
    saveQuizResult?: (data: any) => void;
    quizAjax?: {
      ajaxurl: string;
      nonce: string;
    };
  }
}

// Modifica la mount logic per WordPress
const container = document.getElementById('quiz-sicurezza-root') || document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

### Passo 3: Aggiungere Callback WordPress

Nel componente dove salvi i risultati del quiz, aggiungi:

```typescript
// Nel tuo Results component o dove gestisci il submit finale
const saveToWordPress = (quizData: any) => {
  if (window.saveQuizResult) {
    window.saveQuizResult({
      sector: quizData.sector,
      management_type: quizData.gestione,
      employees: quizData.dipendenti,
      risk_level: quizData.risk.level,
      risk_score: quizData.risk.score,
      violations: JSON.stringify(quizData.violations),
      answers: JSON.stringify(quizData.answers),
      contact_phone: quizData.contactPhone || '',
      contact_email: quizData.contactEmail || ''
    });
  }
};

// Chiama questa funzione quando l'utente completa il quiz
```

### Passo 4: Ottimizza Vite Config

Assicurati che `vite.config.ts` sia ottimizzato per la produzione:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Single file output
        entryFileNames: 'assets/quiz-app.js',
        chunkFileNames: 'assets/quiz-app.js',
        assetFileNames: 'assets/quiz-app.[ext]'
      }
    },
    // Ottimizzazioni per WordPress
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: false
  }
})
```

### Passo 5: Compilazione

```bash
# Pulisci build precedenti
rm -rf dist/

# Compila per produzione
npm run build

# Verifica che i file siano stati creati
ls -la dist/assets/
```

Dovresti vedere:
- `quiz-app.js` (o file JavaScript principale)
- `quiz-app.css` (o file CSS principale)

### Passo 6: Integrazione nel Plugin

```bash
# Naviga alla directory del plugin WordPress
cd wordpress-plugin/

# Copia i file compilati
cp /path/to/react-project/dist/assets/*.js assets/quiz-app.js
cp /path/to/react-project/dist/assets/*.css assets/quiz-app.css

# Verifica che i file siano stati copiati
ls -la assets/
```

### Passo 7: Test del Plugin

```bash
# Crea il file ZIP per WordPress
zip -r quiz-sicurezza-wordpress.zip wordpress-plugin/

# Il plugin è pronto per l'installazione!
```

---

## 🔧 Script di Automazione

Puoi creare uno script per automatizzare il processo:

```bash
#!/bin/bash
# build-wordpress-plugin.sh

echo "🏗️ Building WordPress Plugin..."

# Step 1: Build React app
echo "📦 Compiling React application..."
npm run build

# Step 2: Copy to plugin directory
echo "📁 Copying files to plugin..."
cp dist/assets/*.js wordpress-plugin/assets/quiz-app.js
cp dist/assets/*.css wordpress-plugin/assets/quiz-app.css

# Step 3: Create plugin ZIP
echo "📦 Creating plugin package..."
cd wordpress-plugin
zip -r ../quiz-sicurezza-wordpress.zip .
cd ..

echo "✅ Plugin ready: quiz-sicurezza-wordpress.zip"
echo "📋 Next steps:"
echo "   1. Upload to WordPress"
echo "   2. Activate plugin"
echo "   3. Add [quiz_sicurezza] shortcode to a page"
```

Rendi eseguibile:
```bash
chmod +x build-wordpress-plugin.sh
./build-wordpress-plugin.sh
```

---

## 🧪 Testing e Validazione

### Test Locali Pre-Deploy

1. **Verifica JavaScript**: Apri `assets/quiz-app.js` e controlla che contenga il codice React minificato
2. **Verifica CSS**: Apri `assets/quiz-app.css` e controlla che contenga tutti gli stili Tailwind
3. **Test dimensioni**: I file dovrebbero essere ragionevolmente piccoli (< 2MB totali)

### Test WordPress

```bash
# Installa in un ambiente WordPress locale (XAMPP, Local, etc.)
# Verifica che:
# - Plugin si attivi senza errori
# - Shortcode [quiz_sicurezza] funzioni
# - Quiz sia completamente funzionale
# - Dashboard admin mostri le statistiche
# - Non ci siano conflitti con temi comuni
```

---

## 🚨 Troubleshooting

### Problema: File troppo grandi
```bash
# Analizza bundle size
npm run build -- --analyze

# Ottimizza rimuovendo dipendenze non utilizzate
npm run build -- --minify
```

### Problema: Conflitti CSS con temi WordPress
```css
/* Aggiungi specificity ai tuoi stili */
#quiz-sicurezza-root .your-class {
    property: value !important;
}
```

### Problema: React non si monta
```javascript
// Debug nel browser console
console.log('Container found:', document.getElementById('quiz-sicurezza-root'));

// Verifica che lo shortcode sia presente nella pagina
```

### Problema: AJAX non funziona
```php
// Verifica nel plugin PHP che quizAjax sia localizzato correttamente
wp_localize_script('quiz-sicurezza-app', 'quizAjax', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('quiz_sicurezza_nonce')
));
```

---

## 📝 Checklist Finale

Prima del deployment:

- [ ] ✅ React app compila senza errori
- [ ] ✅ File JavaScript e CSS copiati in `assets/`
- [ ] ✅ Plugin ZIP creato correttamente
- [ ] ✅ Test su WordPress locale completato
- [ ] ✅ Quiz funziona identicamente alla versione React
- [ ] ✅ Dashboard admin mostra i dati
- [ ] ✅ Export CSV funzionante
- [ ] ✅ Nessun conflitto con temi WordPress popolari
- [ ] ✅ Performance accettabili (< 3 secondi caricamento)
- [ ] ✅ Responsive design su mobile/tablet
- [ ] ✅ Documentazione per il cliente pronta

---

## 🎯 Risultato Finale

Una volta completato, avrai:

```
quiz-sicurezza-wordpress.zip
├── quiz-sicurezza.php (Plugin principale)
├── admin/ (Dashboard WordPress)
├── assets/
│   ├── quiz-app.js (React app compilata)
│   └── quiz-app.css (Stili compilati)  
├── readme.txt (Documentazione WordPress)
└── INSTALLATION.md (Guida per il cliente)
```

**🎉 Il plugin è pronto per il cliente con installazione in 2 minuti!**

---

## 📞 Supporto

Per problemi durante la compilazione:
- **Email**: info@spazioimpresamatera.it
- **Telefono**: 095 587 2480
- **WhatsApp**: +39 095 587 2480

---

*Mantiene al 100% tutte le funzionalità, algoritmi e logiche del progetto React originale.*