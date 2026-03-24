import { getAllArticleMeta, getCategoriesWithCount } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import CategoriesSidebarNav from "@/components/CategoriesSidebarNav";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all Chively POS help articles.",
};

export default async function ArticlesPage() {
  const allArticles = await getAllArticleMeta();
  const categories = (await getCategoriesWithCount()).filter((c) => c.articleCount > 0);

  // Group articles by category
  const grouped = categories.map((cat) => ({
    ...cat,
    articles: allArticles.filter((a) => a.categorySlug === cat.slug),
  }));

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Sub-hero */}
      <div className="bg-brand-secondary py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">All Articles</h1>
          <SearchBar articles={allArticles} placeholder="Search all articles…" size="sm" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <CategoriesSidebarNav categories={categories} />
        </aside>

        {/* Article groups */}
        <div className="flex-1 space-y-10 min-w-0">
          {grouped.map((group) => (
            <section key={group.slug} id={group.slug}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-secondary">{group.name}</h2>
                <Link
                  href={`/category/${group.slug}`}
                  className="text-xs text-brand-primary hover:text-brand-secondary transition-colors font-medium"
                >
                  View all →
                </Link>
              </div>
              <div className="bg-white border border-brand-border rounded-xl px-4 divide-y divide-brand-border">
                {group.articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ))}

          {allArticles.length === 0 && (
            <div className="text-center py-20 text-brand-border">
              <p className="text-lg font-medium">No articles yet.</p>
              <p className="text-sm mt-1">Check back soon or contact support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
