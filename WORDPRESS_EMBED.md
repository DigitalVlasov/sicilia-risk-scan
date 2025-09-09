# WordPress Integration Guide

## Quick Start - Iframe Embed

### Basic Iframe Code
```html
<iframe 
  src="https://[YOUR-PROJECT-URL].lovable.app/assessment.html" 
  width="100%" 
  height="800px" 
  frameborder="0" 
  title="Assessment Sicurezza Lavoro">
</iframe>
```

### Responsive Iframe
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
  <iframe 
    src="https://[YOUR-PROJECT-URL].lovable.app/assessment.html" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
    frameborder="0" 
    title="Assessment Sicurezza Lavoro">
  </iframe>
</div>
```

## WordPress Implementation Methods

### Method 1: Page/Post Embed
1. Edit the WordPress page/post where you want the assessment
2. Switch to **HTML/Code view** (not Visual editor)
3. Paste the iframe code
4. Update/publish the page

### Method 2: Custom HTML Block (Gutenberg)
1. Add a new block → **Custom HTML**
2. Paste the iframe code
3. Preview to test functionality

### Method 3: Shortcode (Advanced)
Add to your theme's `functions.php`:

```php
function safety_assessment_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'url' => 'https://[YOUR-PROJECT-URL].lovable.app/assessment.html'
    ), $atts);
    
    return '<iframe src="' . esc_url($atts['url']) . '" width="100%" height="' . esc_attr($atts['height']) . '" frameborder="0" title="Assessment Sicurezza Lavoro"></iframe>';
}
add_shortcode('safety_assessment', 'safety_assessment_shortcode');
```

Usage: `[safety_assessment height="600px"]`

### Method 4: Widget Area
1. Go to **Appearance → Widgets**
2. Add **Custom HTML** widget
3. Paste iframe code
4. Place in desired widget area

## Styling & Customization

### Full Width Display
```css
.assessment-container {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.assessment-container iframe {
  width: 100%;
  height: 800px;
  border: none;
}
```

### Mobile Optimization
```css
@media (max-width: 768px) {
  .assessment-container iframe {
    height: 600px;
  }
}
```

### Custom Background
```css
.assessment-wrapper {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

## Advanced Integration Options

### Option 1: Self-Hosted
1. Download the built files from GitHub
2. Upload to your WordPress hosting
3. Create a custom page template
4. Include the assessment directly

### Option 2: Popup/Modal Integration
Use with popup plugins like:
- Popup Maker
- OptinMonster  
- Elementor Popup

### Option 3: Custom Domain
1. Set up subdomain (e.g., `assessment.yoursite.com`)
2. Configure DNS to point to hosting provider
3. Deploy the assessment there
4. Embed or redirect as needed

## SEO Considerations

### Meta Tags (if using custom page)
```html
<meta name="description" content="Valuta la sicurezza sul lavoro della tua azienda con il nostro assessment gratuito di 90 secondi.">
<meta property="og:title" content="Assessment Sicurezza Lavoro | [Your Company]">
<meta property="og:description" content="Test gratuito per verificare la conformità alle norme di sicurezza sul lavoro.">
```

### Schema Markup
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Assessment Sicurezza Lavoro",
  "description": "Tool per valutare la conformità alle norme di sicurezza sul lavoro",
  "url": "https://yoursite.com/assessment"
}
```

## Performance Tips

1. **Lazy Loading**: Load iframe only when visible
```javascript
// Add intersection observer for lazy loading
const iframe = document.querySelector('.assessment-iframe');
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    iframe.src = iframe.dataset.src;
    observer.disconnect();
  }
});
observer.observe(iframe);
```

2. **Preload**: Add DNS prefetch
```html
<link rel="dns-prefetch" href="https://[YOUR-PROJECT-URL].lovable.app">
```

## Testing Checklist

- [ ] Iframe loads correctly on desktop
- [ ] Mobile responsiveness works
- [ ] All quiz functionality operates within iframe
- [ ] Results display properly
- [ ] Contact buttons work (WhatsApp, phone)
- [ ] Page speed is acceptable
- [ ] No console errors

## Troubleshooting

### Common Issues

**Issue**: Iframe height is cut off
**Solution**: Increase height value or use responsive wrapper

**Issue**: Content not loading
**Solution**: Check HTTPS/HTTP compatibility, verify URL

**Issue**: Mobile display problems  
**Solution**: Add viewport meta tag and responsive CSS

**Issue**: Slow loading
**Solution**: Implement lazy loading or use custom domain

## Support
For WordPress-specific integration help, consult your web developer or WordPress administrator.