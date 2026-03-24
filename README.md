# Chively Help Center

Support documentation site for Chively POS — built with Next.js 15, Tailwind CSS, and MDX.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with Chively brand tokens
- **Content:** MDX files in `/content/articles/`
- **Search:** Fuse.js (client-side, no backend needed)
- **Deploy:** Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Adding articles

Create a new `.mdx` file in `/content/articles/`. Use this frontmatter:

```mdx
---
title: "Your Article Title"
description: "A one-sentence summary shown in search and listings."
category: "Getting Started"
categorySlug: "getting-started"
tags: ["tag1", "tag2"]
publishedAt: "2026-01-01T00:00:00Z"
updatedAt: "2026-03-01T00:00:00Z"
---

Your article content here in Markdown...
```

### Available categorySlug values

| Category | slug |
|---|---|
| Getting Started | `getting-started` |
| Payments & Processing | `payments` |
| Hardware & Equipment | `hardware` |
| Menu & Orders | `menu-orders` |
| Staff & Permissions | `staff` |
| Reports & Analytics | `reports` |
| Online Ordering & Delivery | `online-ordering` |
| Troubleshooting | `troubleshooting` |

## Adding categories

Edit `/lib/articles.ts` → `CATEGORIES` array to add, rename, or reorder categories.

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — no configuration needed beyond what's in `vercel.json`

## Migrating to Sanity CMS

When ready, replace the functions in `/lib/articles.ts` with Sanity GROQ queries.
All components import from this file — nothing else in the codebase changes.

See the comments in `lib/articles.ts` for the migration pattern.
