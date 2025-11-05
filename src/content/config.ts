import { defineCollection, z } from 'astro:content';

// Blog collection schema
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('EuroTCG Team'),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
  }),
});

// Documentation collection schema
const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    lastUpdated: z.date(),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    toc: z.boolean().default(true),
  }),
});

// Legal pages collection schema
const legal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.date(),
    effectiveDate: z.date(),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    jurisdiction: z.string().optional(),
  }),
});

// FAQ collection schema
const faq = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.string(),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    featured: z.boolean().default(false),
  }),
});

// Changelog collection schema
const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    version: z.string(),
    releaseDate: z.date(),
    type: z.enum(['major', 'minor', 'patch', 'hotfix']),
    summary: z.string(),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    breaking: z.boolean().default(false),
  }),
});

// Testimonials collection schema
const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    content: z.string(),
    rating: z.number().min(1).max(5),
    avatar: z.string().optional(),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    featured: z.boolean().default(false),
    verified: z.boolean().default(false),
  }),
});

// Features collection schema
const features = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    category: z.string(),
    order: z.number().default(0),
    locale: z.enum(['en', 'fr', 'de', 'es', 'it', 'nl']).default('en'),
    status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
    highlight: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  docs,
  legal,
  faq,
  changelog,
  testimonials,
  features,
};