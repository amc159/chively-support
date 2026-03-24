import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { hasSanityConfig, sanityClient } from "@/lib/sanity.client";
import { allArticlesQuery, articleBySlugQuery, categoriesQuery } from "@/lib/sanity.queries";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type RichBodyContent = any[] | string;

export type Article = {
  slug: string;
  title: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  category: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  content: RichBodyContent;
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
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    category: data.category ?? "General",
    categorySlug: data.categorySlug ?? "general",
    tags: data.tags ?? [],
    publishedAt: data.publishedAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt,
    content,
  };
}

async function getSanityArticles(): Promise<Article[] | null> {
  if (!hasSanityConfig || !sanityClient) return null;

  try {
    const rows = await sanityClient.fetch<any[]>(allArticlesQuery);
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title ?? "Untitled",
      description: row.description ?? "",
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      category: row.category ?? "General",
      categorySlug: row.categorySlug ?? "general",
      tags: row.tags ?? [],
      publishedAt: row.publishedAt ?? new Date().toISOString(),
      updatedAt: row.updatedAt,
      content: row.body ?? [],
    }));
  } catch {
    return null;
  }
}

async function getSanityCategories(): Promise<Omit<Category, "articleCount">[] | null> {
  if (!hasSanityConfig || !sanityClient) return null;

  try {
    const rows = await sanityClient.fetch<any[]>(categoriesQuery);
    return rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon || "Rocket",
    }));
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  const sanityArticles = await getSanityArticles();
  if (sanityArticles && sanityArticles.length > 0) return sanityArticles;

  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files.map(readArticleFile).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getAllArticleMeta(): Promise<ArticleMeta[]> {
  const articles = await getAllArticles();
  return articles.map(({ content: _content, ...meta }) => meta);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (hasSanityConfig && sanityClient) {
    try {
      const row = await sanityClient.fetch<any | null>(articleBySlugQuery, { slug });
      if (row) {
        return {
          slug: row.slug,
          title: row.title ?? "Untitled",
          description: row.description ?? "",
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          category: row.category ?? "General",
          categorySlug: row.categorySlug ?? "general",
          tags: row.tags ?? [],
          publishedAt: row.publishedAt ?? new Date().toISOString(),
          updatedAt: row.updatedAt,
          content: row.body ?? [],
        };
      }
    } catch {
      // Falls back to local MDX when Sanity query fails.
    }
  }

  const files = fs.existsSync(ARTICLES_DIR) ? fs.readdirSync(ARTICLES_DIR) : [];
  const match = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!match) return undefined;
  return readArticleFile(match);
}

export async function getArticlesByCategory(categorySlug: string): Promise<ArticleMeta[]> {
  const meta = await getAllArticleMeta();
  return meta.filter((a) => a.categorySlug === categorySlug);
}

export async function getCategoriesWithCount(): Promise<Category[]> {
  const meta = await getAllArticleMeta();
  const sanityCategories = await getSanityCategories();
  const source = sanityCategories && sanityCategories.length > 0 ? sanityCategories : CATEGORIES;

  return source.map((cat) => ({
    ...cat,
    articleCount: meta.filter((a) => a.categorySlug === cat.slug).length,
  }));
}

export async function getAllSlugs(): Promise<string[]> {
  const articles = await getAllArticles();
  return articles.map((a) => a.slug);
}
