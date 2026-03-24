/**
 * lib/articles.ts
 *
 * Data layer for articles. Currently reads from /content/articles/*.mdx (local files).
 *
 * ── SANITY MIGRATION ──────────────────────────────────────────────────────────
 * When you're ready to move to Sanity, replace the functions in this file with
 * Sanity GROQ queries. All components import from here, so nothing else changes.
 *
 * Example Sanity swap:
 *   import { client } from "@/lib/sanity"
 *   export async function getAllArticles() {
 *     return client.fetch(`*[_type == "article"] | order(publishedAt desc)`)
 *   }
 * ──────────────────────────────────────────────────────────────────────────────
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  content: string; // raw MDX string
};

export type ArticleMeta = Omit<Article, "content">;

export type Category = {
  name: string;
  slug: string;
  description: string;
  icon: string; // lucide icon name
  articleCount: number;
};

// ─── Category definitions ─────────────────────────────────────────────────────
// Add/rename categories here as your article library grows.
export const CATEGORIES: Omit<Category, "articleCount">[] = [
  {
    name: "Getting Started",
    slug: "getting-started",
    description: "Set up your Chively POS system and go live fast.",
    icon: "Rocket",
  },
  {
    name: "Payments & Processing",
    slug: "payments",
    description: "Rates, funding timelines, surcharging, and payment splits.",
    icon: "CreditCard",
  },
  {
    name: "Hardware & Equipment",
    slug: "hardware",
    description: "POS devices, printers, scanners, and peripherals.",
    icon: "Monitor",
  },
  {
    name: "Menu & Orders",
    slug: "menu-orders",
    description: "Build menus, modifiers, KDS routing, and order flow.",
    icon: "UtensilsCrossed",
  },
  {
    name: "Staff & Permissions",
    slug: "staff",
    description: "Roles, time clock, permissions, and manager controls.",
    icon: "Users",
  },
  {
    name: "Reports & Analytics",
    slug: "reports",
    description: "Sales reports, exports, real-time dashboards, and insights.",
    icon: "BarChart2",
  },
  {
    name: "Online Ordering & Delivery",
    slug: "online-ordering",
    description: "Online ordering setup and third-party delivery integrations.",
    icon: "ShoppingBag",
  },
  {
    name: "Troubleshooting",
    slug: "troubleshooting",
    description: "Common issues, error fixes, and offline mode guidance.",
    icon: "Wrench",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readArticleFile(filename: string): Article {
  const filePath = path.join(ARTICLES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");

  return {
    slug,
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    category: data.category ?? "General",
    categorySlug: data.categorySlug ?? "general",
    tags: data.tags ?? [],
    publishedAt: data.publishedAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt,
    content,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map(readArticleFile)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getAllArticleMeta(): ArticleMeta[] {
  return getAllArticles().map(({ content: _content, ...meta }) => meta);
}

export function getArticleBySlug(slug: string): Article | undefined {
  const files = fs.existsSync(ARTICLES_DIR) ? fs.readdirSync(ARTICLES_DIR) : [];
  const match = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!match) return undefined;
  return readArticleFile(match);
}

export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  return getAllArticleMeta().filter((a) => a.categorySlug === categorySlug);
}

export function getCategoriesWithCount(): Category[] {
  const meta = getAllArticleMeta();
  return CATEGORIES.map((cat) => ({
    ...cat,
    articleCount: meta.filter((a) => a.categorySlug === cat.slug).length,
  }));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
