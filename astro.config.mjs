import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://eurotcg.com', // Replace with your actual domain
  trailingSlash: 'ignore',
  
  // Internationalization
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de', 'es', 'it', 'nl'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true,
    },
    fallback: {
      fr: 'en',
      de: 'en',
      es: 'en',
      it: 'en',
      nl: 'en',
    },
  },

  // Integrations
  integrations: [
    tailwind({
      applyBaseStyles: false, // We'll use our custom base styles
    }),
    react({
      include: ['**/react/*'],
    }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          fr: 'fr-FR',
          de: 'de-DE',
          es: 'es-ES',
          it: 'it-IT',
          nl: 'nl-NL',
        },
      },
    }),
  ],

  // Image optimization
  image: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },

  // Build configuration
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
  },

  // Prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Security headers
  security: {
    checkOrigin: true,
  },

  // Experimental features
  experimental: {
    contentCollectionCache: true,
  },

  // Output configuration
  output: 'static',
  adapter: undefined, // Static generation for Docker deployment

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: ['@radix-ui/*'],
    },
  },
});