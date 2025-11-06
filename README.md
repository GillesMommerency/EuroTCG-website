# EuroTCG Website

A modern, European-focused trading card game collection manager website built
with Astro, featuring multilingual support, GDPR compliance, and performance
optimization.

## 🚀 Features

- **Modern Stack**: Built with Astro, React, TypeScript, and Tailwind CSS
- **Internationalization**: Full i18n support for EN, FR, DE, ES, IT, NL
- **Performance First**: Optimized for Core Web Vitals and lighthouse scores
- **Accessibility**: WCAG AA compliant with comprehensive testing
- **SEO Optimized**: Structured data, meta tags, and sitemap generation
- **GDPR Compliant**: EU-focused privacy and data protection
- **Dark Mode**: System preference aware theme switching
- **Responsive Design**: Mobile-first approach with all device support
- **Docker Ready**: Production deployment with Docker and nginx
- **CI/CD Pipeline**: GitHub Actions with automated testing and deployment

## 🛠️ Tech Stack

### Frontend

- **Framework**: Astro 4.x (Static Site Generation)
- **UI Framework**: React 18 (for interactive islands)
- **Styling**: Tailwind CSS 3.x with CSS variables
- **Components**: Radix UI Primitives
- **Animations**: Motion One
- **Typography**: Inter Variable font

### Development

- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint with accessibility rules
- **Formatting**: Prettier with Astro plugin
- **Performance**: Lighthouse CI

### Deployment

- **Containerization**: Docker
- **Web Server**: nginx
- **Reverse Proxy**: Traefik (with SSL termination)
- **CI/CD**: GitHub Actions
- **Monitoring**: Health checks and performance budgets

## 📁 Project Structure

```
eurotcg-website/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions pipeline
├── public/
│   ├── favicon.svg            # Brand favicon
│   ├── robots.txt             # SEO directives
│   └── site.webmanifest       # PWA manifest
├── src/
│   ├── assets/                # Static assets
│   ├── components/
│   │   ├── react/             # React islands
│   │   └── SEO.astro          # SEO component
│   ├── content/
│   │   └── config.ts          # Content collections
│   ├── layouts/
│   │   └── BaseLayout.astro   # Main layout
│   ├── lib/
│   │   ├── i18n.ts            # Internationalization
│   │   └── utils.ts           # Utility functions
│   ├── locales/               # Translation files
│   ├── pages/
│   │   └── index.astro        # Homepage
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── types/                 # TypeScript types
├── tests/
│   └── homepage.spec.ts       # E2E tests
├── astro.config.mjs           # Astro configuration
├── docker-compose.yml         # Production deployment
├── Dockerfile                 # Container definition
├── tailwind.config.mjs        # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (for deployment)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/eurotcg/eurotcg-website.git
   cd eurotcg-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** Navigate to `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check Prettier formatting
npm run type-check       # TypeScript type checking

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run deploy           # Build and deploy
```

## 🌍 Internationalization

The site supports 6 European languages:

- **English** (en) - Default
- **French** (fr)
- **German** (de)
- **Spanish** (es)
- **Italian** (it)
- **Dutch** (nl)

### URL Structure

- Default locale (EN): `eurotcg.com/`
- Other locales: `eurotcg.com/fr/`, `eurotcg.com/de/`, etc.

### Adding Translations

1. Add translations to `src/locales/{locale}.ts`
2. Update the locale configuration in `src/lib/i18n.ts`
3. Add route handling in `astro.config.mjs`

## 🎨 Styling

### Design System

- **Colors**: Semantic color system with CSS variables
- **Typography**: Inter variable font with optimized loading
- **Spacing**: Consistent spacing scale using Tailwind
- **Components**: Reusable component patterns
- **Dark Mode**: System preference with manual toggle

### Theme Customization

Customize the theme in `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      // Add custom colors
    }
  }
}
```

Update CSS variables in `src/styles/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  /* Add custom properties */
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# Site configuration
SITE=https://eurotcg.com

# Analytics (optional)
PLAUSIBLE_DOMAIN=eurotcg.com

# Newsletter service (optional)
MAILERLITE_API_KEY=your_api_key
```

### Astro Configuration

Key configuration options in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://eurotcg.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de', 'es', 'it', 'nl'],
  },
  integrations: [tailwind(), react(), mdx(), sitemap()],
});
```

## 🚢 Deployment

### Docker Deployment

1. **Build and run locally**

   ```bash
   npm run docker:build
   npm run docker:run
   ```

2. **Production deployment**

   ```bash
   # Using the deployment script
   chmod +x deploy.sh
   ./deploy.sh --backup --cleanup

   # Or using docker-compose
   docker-compose up -d
   ```

### Server Requirements

- Linux server with Docker and Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)
- Minimum 1GB RAM, 1 CPU core

### Deployment Script

The included `deploy.sh` script provides:

- Automated Docker builds
- Zero-downtime deployments
- Health checks and rollback
- Backup and cleanup options

```bash
./deploy.sh --help  # Show all options
```

## 📊 Performance

### Lighthouse Scores

Target scores (enforced by CI):

- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

### Core Web Vitals

- **FCP**: < 2.0s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **TBT**: < 300ms

### Optimization Features

- Image optimization with Astro's built-in tools
- Font optimization with variable fonts
- CSS/JS minification and compression
- Gzip/Brotli compression
- Service worker for caching (future)

## 🧪 Testing

### Test Types

- **Unit Tests**: Component logic testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: WCAG compliance testing
- **Performance Tests**: Core Web Vitals monitoring

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test tests/homepage.spec.ts

# Run tests in watch mode
npm run test -- --watch
```

## 🔒 Security

### Security Headers

Implemented security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### GDPR Compliance

- Cookieless analytics (Plausible)
- Privacy-first design
- Data minimization
- Clear privacy policy
- User consent management (when needed)

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards

- Follow TypeScript strict mode
- Use Prettier for formatting
- Follow accessibility guidelines
- Write comprehensive tests
- Update documentation

### Commit Convention

We use conventional commits:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📈 Roadmap

### Phase 1: Under Construction (Current)

- [x] Basic site structure
- [x] Multilingual support
- [x] Performance optimization
- [x] Deployment pipeline

### Phase 2: MVP Features

- [ ] User authentication
- [ ] Card scanning functionality
- [ ] Collection management
- [ ] Basic marketplace

### Phase 3: Advanced Features

- [ ] Social features
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API integration

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Vercel](https://vercel.com/) for inspiration on developer experience

## 📞 Support

- **Email**: hello@eurotcg.com
- **GitHub Issues**:
  [Report a bug](https://github.com/eurotcg/eurotcg-website/issues)
- **Discord**: [Join our community](https://discord.gg/eurotcg)

---

**Made with ❤️ in Europe**
