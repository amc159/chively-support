import { getCategoriesWithCount, getAllArticleMeta } from "@/lib/articles";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default async function HomePage() {
  const categories = await getCategoriesWithCount();
  const allArticles = await getAllArticleMeta();
  const recentArticles = allArticles.slice(0, 5);
  const totalArticles = allArticles.length;

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="hero-noise-bg text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-xs font-semibold text-brand-accent uppercase tracking-widest mb-4">
            Chively Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            How can we help you?
          </h1>
          <p className="text-white/60 text-base mb-8">
            Browse {totalArticles} articles across {categories.filter(c => c.articleCount > 0).length} topics,
            or search for anything below.
          </p>

          <SearchBar articles={allArticles} placeholder="Search for anything… payments, hardware, setup…" size="lg" />

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/50">
            <a href="tel:+18004398229" className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Phone size={13} /> +1 (800) 439-8229
            </a>
            <span className="text-white/20">|</span>
            <a href="mailto:support@chively.com" className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Mail size={13} /> support@chively.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <section className="bg-brand-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-brand-secondary">Browse by topic</h2>
              <p className="text-sm text-brand-dark/85 mt-1">Find answers organized by feature area.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent articles ─────────────────────────────────────────── */}
      {recentArticles.length > 0 && (
        <section className="bg-brand-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-secondary">Recently updated</h2>
                <p className="text-sm text-brand-dark/85 mt-1">The latest additions to the help center.</p>
              </div>
              <Link
                href="/articles"
                className="flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-secondary transition-colors font-medium"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-white border border-brand-border rounded-xl px-4 divide-y divide-brand-border">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact strip ────────────────────────────────────────────── */}
      <section className="bg-brand-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-semibold text-lg">{"Can't find what you're looking for?"}</h3>
            <p className="text-white/70 text-sm mt-1">Our support team is available 24/7 to help you.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:+18004398229" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Phone size={14} /> Call us
            </a>
            <a href="mailto:support@chively.com" className="flex items-center gap-2 bg-brand-accent text-brand-secondary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              <Mail size={14} /> Email support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
