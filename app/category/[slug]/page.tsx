import { getArticlesByCategory, getCategoriesWithCount } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import {
  Rocket, CreditCard, Monitor, UtensilsCrossed,
  Users, BarChart2, ShoppingBag, Wrench, LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket, CreditCard, Monitor, UtensilsCrossed,
  Users, BarChart2, ShoppingBag, Wrench,
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cats = getCategoriesWithCount();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = getCategoriesWithCount();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cats = getCategoriesWithCount();
  const category = cats.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);
  const Icon = ICON_MAP[category.icon] ?? Rocket;

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Breadcrumb */}
      <div className="bg-brand-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-brand-dark/70">
          <Link href="/" className="hover:text-brand-primary transition-colors">Help Center</Link>
          <ChevronRight size={14} />
          <span className="text-brand-dark">{category.name}</span>
        </div>
      </div>

      {/* Category header */}
      <div className="bg-brand-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon size={26} className="text-brand-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            <p className="text-white/60 text-sm mt-1">{category.description}</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <span className="text-3xl font-bold text-white">{category.articleCount}</span>
            <p className="text-white/50 text-xs">articles</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar — other categories */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wider mb-3">
                All categories
              </p>
              <div className="space-y-1">
                {cats.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                      ${cat.slug === slug
                        ? "bg-brand-primary text-white font-medium"
                        : "text-brand-dark hover:bg-white hover:text-brand-primary"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs ${cat.slug === slug ? "text-white/70" : "text-brand-dark/45 group-hover:text-brand-primary/80"}`}>
                      {cat.articleCount}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Article list */}
          <div className="flex-1 min-w-0">
            {articles.length > 0 ? (
              <div className="bg-white border border-brand-border rounded-xl px-4 divide-y divide-brand-border">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-brand-border rounded-xl p-12 text-center">
                <p className="text-brand-border text-sm">No articles in this category yet.</p>
                <Link href="/" className="text-brand-primary text-sm mt-2 inline-block hover:underline">
                  Back to Help Center
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
