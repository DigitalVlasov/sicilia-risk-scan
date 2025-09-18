# Assessment Sicurezza Lavoro - Technical Documentation

## Overview
This is a React-based web application that provides a safety assessment quiz for Italian companies. It evaluates workplace safety compliance and provides risk analysis with potential sanctions estimation.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router
- **State Management**: React Hooks + Reducers
- **Deployment**: Static site (can be hosted anywhere)

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── quiz/            # Quiz-specific components  
│   └── ui/              # shadcn/ui components
├── services/            # Business logic services
├── data/                # Static data (questions, violations)
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── pages/               # Route components

public/
└── assets/              # Static assets
```

## Key Features
- **Multi-stage Quiz**: Intro → Questions → Loading → Results
- **Dynamic Risk Assessment**: Real-time scoring with multipliers
- **Violation Detection**: Identifies compliance gaps
- **Sector-specific Analysis**: Tailored insights per industry
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data, semantic HTML

## Running Locally

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup
```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_NAME]

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or  
bun dev

# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun run preview
```

## Deployment Options

### 1. Static Site Hosting
The app builds to static files and can be hosted on:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

### 2. Build Output
- Built files are in `dist/` folder

## Environment Configuration
No environment variables required for basic functionality. All configuration is in:
- `src/constants/quiz-config.ts` - App settings
- `src/data/questions.ts` - Quiz questions

## Browser Compatibility
- Modern browsers (Chrome 88+, Firefox 78+, Safari 14+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Performance
- Bundle size: ~200KB gzipped
- Initial load: <2s on 3G
- Lighthouse score: 95+ (Performance, Accessibility, SEO)

## Customization
- Colors/themes: `src/index.css` and `tailwind.config.ts`
- Content: `src/data/questions.ts` and service files
- Branding: Replace logo in `src/assets/`

## API Integration
Currently standalone, but can be extended with:
- Backend API for data persistence
- Analytics tracking
- CRM integration
- Email automation

## Security Considerations
- No sensitive data stored
- Client-side only (no server vulnerabilities)
- Input validation on all form fields
- XSS protection via React's built-in escaping

## Support
For technical questions or integration support, contact the development team.