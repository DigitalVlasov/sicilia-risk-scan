# Deployment Guide

## GitHub Pages Setup

### Automatic Deployment
1. Push code to GitHub repository
2. Go to repository **Settings** → **Pages**
3. Set source to **GitHub Actions**
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### Manual Setup
1. Build the project: `npm run build`
2. Copy `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Netlify Deployment

### From GitHub (Recommended)
1. Connect Netlify to your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Manual Deploy
1. Build locally: `npm run build`
2. Drag `dist/` folder to Netlify deploy area
3. Get deployment URL

### Custom Domain
1. Add domain in Netlify dashboard
2. Configure DNS records:
   - A record: `104.198.14.52`
   - CNAME: `your-site.netlify.app`

## Vercel Deployment

### From GitHub
1. Connect Vercel to GitHub repository
2. Import project
3. Default settings work automatically
4. Deploy

### CLI Deployment
```bash
npm install -g vercel
vercel --prod
```

## Custom Server Deployment

### Requirements
- Web server (Apache/Nginx)
- HTTPS certificate
- Static file serving capability

### Build & Upload
```bash
# Build production files
npm run build

# Upload dist/ contents to web server
# Example with rsync:
rsync -avz dist/ user@server:/var/www/html/assessment/
```

### Apache Configuration
```apache
<Directory "/var/www/html/assessment">
    Options -Indexes
    AllowOverride All
    Require all granted
    
    # Handle React Router
    RewriteEngine On
    RewriteBase /assessment/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /assessment/index.html [L]
</Directory>
```

### Nginx Configuration
```nginx
location /assessment {
    alias /var/www/html/assessment;
    try_files $uri $uri/ /assessment/index.html;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Environment Configuration

### Production Build
Update `vite.config.ts` for custom base path:

```typescript
export default defineConfig({
  base: '/assessment/', // Adjust for subdirectory deployment
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

### Multiple Environments
Create environment-specific configs:

```bash
# .env.production
VITE_APP_URL=https://your-domain.com
VITE_CONTACT_PHONE=+39xxxxxxxxx
```

## Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
});
```

### CDN Setup
1. Upload assets to CDN
2. Update asset URLs in build
3. Configure CORS headers

## Monitoring & Analytics

### Basic Analytics
Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

## Security Headers

### Recommended Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Backup & Recovery

### Code Backup
- GitHub repository serves as primary backup
- Tag releases for stable versions
- Document deployment process

### Data Backup
- Export quiz configuration regularly
- Backup custom content/translations
- Monitor for configuration drift

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor performance metrics
- Review analytics data
- Test functionality quarterly

### Update Process
1. Test changes in development
2. Deploy to staging environment
3. Run full test suite
4. Deploy to production
5. Monitor for issues

This guide covers the main deployment scenarios. Choose the method that best fits your infrastructure and requirements.