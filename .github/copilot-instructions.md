# EuroTCG Website - AI Coding Agent Instructions

## Architecture Overview

This is an **Astro-based informational website for a European trading card game app** with strict European focus, GDPR compliance, and performance-first approach. The site is purely informational (no backend) but will evolve from "under construction" to showcase the mobile app. Uses Astro Islands architecture with selective React hydration for interactive components.

### Core Stack
- **Framework**: Astro 5.x (Static Site Generation)
- **Styling**: Tailwind CSS with CSS-in-JS color system via HSL variables
- **Interactive Components**: React 18 (islands only in `src/components/react/`)
- **Internationalization**: Custom i18n system supporting EN, FR, DE, ES, IT, NL
- **Deployment**: Docker + nginx for production

## Critical Architecture Patterns

### 1. Internationalization System
The i18n system is **completely custom** - do not suggest Astro's built-in i18n beyond the basic routing config in `astro.config.mjs`.

**Key files**: `src/lib/i18n.ts`, `src/locales/*.ts`

```typescript
// Always use this pattern for locale detection
const locale = getLocaleFromUrl(Astro.url);

// URL structure: 
// EN (default): eurotcg.com/
// Others: eurotcg.com/fr/, eurotcg.com/de/
```

**Translation Usage**:
- Import specific locale: `import en from '@/locales/en'`
- Access nested keys: `en.underConstruction.newsletter.title`
- Never hardcode strings - all text must go through translation files

### 2. Styling System
Uses **semantic color system** with CSS variables, NOT traditional Tailwind colors.

**Critical pattern in `tailwind.config.mjs`**:
```javascript
colors: {
  primary: 'hsl(var(--primary))',
  background: 'hsl(var(--background))',
  // Use semantic names, not color names
}
```

**CSS Variables** in `src/styles/globals.css`:
- Light/dark mode via CSS custom properties
- TCG brand colors: `--tcg-blue`, `--tcg-red`, etc.
- Always use `hsl()` format

### 3. Component Architecture
- **Astro components**: Static layouts, SEO, base structure (`src/layouts/`, `src/components/SEO.astro`)
- **React islands**: Interactive features only (`src/components/react/`)
- **Utility first**: Use `cn()` helper from `src/lib/utils.ts` for conditional classes

```tsx
// Correct React component pattern
import { cn } from '@/lib/utils';

const Component = () => (
  <div className={cn('base-classes', condition && 'conditional-classes')}>
);
```

## Development Workflows

### Build Commands (use these exactly)
```bash
npm run dev              # Development (port 3000)
npm run build            # Build + type check
npm run preview          # Preview build (port 4321)
```

### Testing Strategy
```bash
npm run test             # Playwright E2E tests (all browsers)
npm run test:ui          # Interactive test runner
npm run test:headed      # Visual debugging mode
```
**Config**: `config/playwright.config.ts` - tests expect preview server on port 4321

**Test Coverage**:
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness (Pixel 5, iPhone 12)
- Accessibility compliance (WCAG AA)
- Performance budgets and Core Web Vitals
- Multilingual functionality across all locales

### Deployment Environments
```bash
npm run docker:build     # Multi-stage Alpine build
npm run docker:run       # Local container testing
npm run deploy           # Full deployment pipeline
```

**Environments**:
- **Development**: `npm run dev` (port 3000, hot reload)
- **Staging**: Docker compose with staging config
- **Production**: nginx Alpine container with health checks
- **Config**: Environment-specific settings in `docker/` directory

## Project-Specific Conventions

### 1. File Organization
- **Configs in `config/`**: `tailwind.config.mjs`, `playwright.config.ts`
- **Absolute imports**: Use `@/` alias for `src/` (configured in `tsconfig.json`)
- **React components**: Only in `src/components/react/` directory

### 2. Performance Requirements (Top Tier Standards)
- **Lighthouse scores**: 95+ target (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: LCP <1.2s, FID <100ms, CLS <0.1
- **Image optimization**: Always use Astro's `<Image>` component with proper sizing
- **Font loading**: Inter Variable font preloaded in `BaseLayout.astro`
- **Critical CSS**: Inlined in `BaseLayout.astro`
- **Bundle size**: Monitor and minimize JavaScript payload

### 3. GDPR Compliance Patterns
- **Analytics**: Plausible (cookieless) only
- **Theme detection**: Uses `localStorage` with graceful fallbacks
- **No tracking**: No Google Analytics or other tracking scripts

### 4. Accessibility Requirements
- **Skip links**: Required in `BaseLayout.astro`
- **ARIA labels**: All interactive elements
- **Focus management**: CSS focus-visible patterns in globals.css
- **Reduced motion**: Respects `prefers-reduced-motion`

## Integration Points

### Theme System
Theme toggle in `src/components/react/ThemeToggle.tsx` syncs with:
1. CSS custom properties in `:root` and `.dark`
2. `localStorage` persistence
3. System preference detection (inline script in `BaseLayout.astro`)

### SEO Integration
`src/components/SEO.astro` handles:
- Multilingual meta tags
- hreflang alternates (uses `getAlternateLinks()` from i18n)
- Structured data
- Open Graph images

### Docker Production
Multi-stage build pattern:
1. **deps**: Install production dependencies
2. **builder**: Build Astro site
3. **runner**: nginx Alpine serving static files

## Common Gotchas

1. **React hydration**: Components in `src/components/react/` auto-hydrate. Use `client:load`, `client:visible` directives when needed.

2. **CSS variables**: Never use Tailwind's default colors - always use semantic system (`bg-background` not `bg-white`)

3. **Locale paths**: Default locale (EN) has no prefix. Use `getLocalizedPath()` helper for URL generation.

4. **Config locations**: Tailwind config is in `config/` not root - update import paths accordingly.

5. **Testing ports**: Dev server (3000) vs preview server (4321) - tests use preview port.

## Key Dependencies to Understand

- **@radix-ui/***: Headless UI components (Accordion, Dialog, etc.)
- **motion**: Animation library (not Framer Motion)
- **astro-seo**: Additional SEO utilities beyond custom SEO component
- **clsx + tailwind-merge**: Class merging via `cn()` utility

## Content Evolution Pattern

This site evolves from "under construction" to full app showcase:
- **Phase 1**: Under construction page with newsletter signup
- **Phase 2**: App feature showcase, screenshots, download links
- **Phase 3**: Full marketing site with testimonials, guides, support

All content must remain **informational only** - no user accounts, data collection, or app functionality embedded in the website.

## Development Priorities

When adding features, always consider in this order:
1. **Performance impact**: Maintain top-tier Lighthouse scores
2. **Multilingual support**: All text must be translatable
3. **GDPR compliance**: No tracking, minimal data collection
4. **Accessibility**: WCAG AA compliance for all interactions
5. **Mobile-first**: Responsive design with mobile optimization