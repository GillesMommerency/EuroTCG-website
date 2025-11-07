# SEO Protection and Lighthouse CI Implementation

## Overview

This implementation adds comprehensive protection against search engine indexing
for your staging environment and integrates Lighthouse CI into your build
pipeline.

## Changes Made

### 1. Staging Environment SEO Protection

#### A. Environment-Specific robots.txt

- **Created**: `public/robots.staging.txt` - Completely blocks all search
  engines
- **Updated**: `docker/nginx.conf` - Serves appropriate robots.txt based on
  hostname
- **Created**: `docker/nginx.staging.conf` - Staging-specific nginx
  configuration with additional anti-indexing headers

#### B. Meta Tag Protection

- **Updated**: `src/layouts/BaseLayout.astro` - Auto-detects staging environment
  and adds `noindex` meta tags
- Detection methods:
  - `NODE_ENV=staging`
  - Hostname contains 'staging', 'dev', or 'preview'
  - Manual `noIndex` prop override

#### C. HTTP Headers Protection

- Added `X-Robots-Tag` headers to all responses in staging
- Headers include:
  `noindex, nofollow, nosnippet, noarchive, notranslate, noimageindex`

#### D. Docker Configuration

- **Created**: `docker/Dockerfile.staging` - Staging-specific Docker build
- **Updated**: GitHub Actions to use staging Dockerfile when building staging
  branch
- Staging containers are clearly labeled for identification

### 2. Lighthouse CI Integration

#### A. Configuration

- **Updated**: `config/.lighthouserc.json`
  - Tests multiple language pages (EN, FR, DE)
  - Uses Astro preview server instead of http-server
  - Runs 3 tests per URL for accuracy
  - Realistic performance thresholds for development:
    - Performance: 70+ score (warn level)
    - Accessibility: 80+ score (error level)
    - Best Practices: 80+ score (warn level)
    - SEO: 90+ score (error level)
    - LCP: < 4.5s
    - CLS: < 0.25
    - TBT: < 600ms

#### B. GitHub Actions Integration

- **Uses**: `treosh/lighthouse-ci-action@v12` (official, secure action)
- **Removed**: Vulnerable `@lhci/cli` npm package
- **Added**: Performance budget configuration in `config/budget.json`
- **Benefits**: No security vulnerabilities, automatic uploads, better reporting

#### C. CI/CD Integration

- **Updated**: `.github/workflows/ci-cd.yml`
  - Uses official Lighthouse CI GitHub Action
  - Automatic artifact uploads to temporary storage
  - Public report URLs generated automatically
  - Integrates with GitHub status checks
  - No local dependencies required

## How It Works

### Staging Protection Layers

1. **DNS/Hostname Detection**: Automatically detects staging environments
2. **robots.txt**: Serves blocking robots.txt for staging domains
3. **Meta Tags**: Adds `<meta name="robots" content="noindex, nofollow">`
4. **HTTP Headers**: Server-level `X-Robots-Tag` headers
5. **Sitemap**: Blocks sitemap.xml access on staging

### Lighthouse CI Flow

1. Code is built and artifacts are created
2. Lighthouse CI starts Astro preview server
3. Tests are run against multiple pages
4. Results are compared against your performance thresholds
5. Build fails if any threshold is exceeded
6. Results are uploaded as GitHub Actions artifacts

## Usage

### Local Testing

For local Lighthouse testing, use the official CLI directly:

```bash
# Install Lighthouse globally (optional)
npm install -g lighthouse

# Run Lighthouse on your local dev/preview server
npm run build
npm run preview &
lighthouse http://localhost:4321 --output html --output-path ./lighthouse-report.html

# Or use npx (no global install needed)
npx lighthouse http://localhost:4321 --output html --output-path ./lighthouse-report.html
```

### Deployment

- **Production**: Uses standard Dockerfile and nginx.conf (no blocking)
- **Staging**: Uses Dockerfile.staging and nginx.staging.conf (full blocking)

### Monitoring

- View Lighthouse results in GitHub Actions artifacts
- Each run tests 3 pages with 3 runs each for statistical accuracy
- Results include detailed performance metrics and suggestions

## Environment Variables

The system automatically detects staging environments via:

- `NODE_ENV=staging`
- Hostname patterns (staging._, dev._, preview.\*)
- Manual overrides via `noIndex` prop

## Benefits

1. **SEO Protection**: Your staging site won't appear in search results
2. **Performance Monitoring**: Automated Lighthouse testing ensures performance
   standards
3. **Multi-language Testing**: Tests performance across different locales
4. **Fail-Fast**: Build stops if performance degrades
5. **Historical Data**: Lighthouse results stored as artifacts for trend
   analysis

## Next Steps

1. **Optional**: Set up Lighthouse CI server for historical tracking
2. **Optional**: Add performance budgets for specific assets
3. **Optional**: Configure Lighthouse to test additional user journeys
4. **Monitor**: Check GitHub Actions artifacts after each deployment for
   performance insights
