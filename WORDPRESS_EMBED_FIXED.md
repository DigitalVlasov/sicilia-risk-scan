# WordPress Embed - Codice Corretto

## URL Corretto
Usa questo URL per l'embed: `https://digitalvlasov.github.io/sicilia-risk-scan/`

## Codice HTML per WordPress

### Metodo 1: Iframe Semplice
```html
<iframe 
  src="https://digitalvlasov.github.io/sicilia-risk-scan/" 
  width="100%" 
  height="800px" 
  frameborder="0" 
  style="border: none; display: block;"
  title="Quiz Sicurezza Aziendale">
</iframe>
```

### Metodo 2: Iframe Responsive (Consigliato)
```html
<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0;">
  <iframe 
    src="https://digitalvlasov.github.io/sicilia-risk-scan/" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0" 
    title="Quiz Sicurezza Aziendale">
  </iframe>
</div>
```

### Metodo 3: Con Stili Anti-Parallax
```html
<div class="quiz-container" style="width: 100%; max-width: 100%; overflow: hidden;">
  <iframe 
    src="https://digitalvlasov.github.io/sicilia-risk-scan/" 
    width="100%" 
    height="800px" 
    frameborder="0" 
    scrolling="no"
    style="border: none; display: block; margin: 0 auto;"
    title="Quiz Sicurezza Aziendale">
  </iframe>
</div>

<style>
.quiz-container {
  margin: 20px 0;
}
body {
  overflow-x: hidden;
}
</style>
```

## Istruzioni per WordPress

1. **Vai al post/pagina WordPress**
2. **Passa alla modalità "Testo" o "HTML"** (non Visual)
3. **Incolla uno dei codici sopra**
4. **Salva/Aggiorna la pagina**

## Se continua ad apparire bianco

Prova questo codice con loading esplicito:

```html
<iframe 
  src="https://digitalvlasov.github.io/sicilia-risk-scan/" 
  width="100%" 
  height="800px" 
  frameborder="0" 
  onload="console.log('Quiz caricato')"
  onerror="console.log('Errore caricamento quiz')"
  style="border: none; background: #f5f5f5;"
  title="Quiz Sicurezza Aziendale">
  <p>Il tuo browser non supporta gli iframe. <a href="https://digitalvlasov.github.io/sicilia-risk-scan/" target="_blank">Clicca qui per aprire il quiz</a></p>
</iframe>
```