import { getArticleBySlug, getAllSlugs, getArticlesByCategory, getCategoriesWithCount } from "@/lib/articles";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ChevronRight, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity.client";
import Image from "next/image";

type Props = { params: Promise<{ slug: string }> };

const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = imageBuilder?.image(value).width(1200).fit("max").auto("format").url();
      if (!src) return null;
      const alt = value?.alt || "Article image";
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto rounded-xl border border-brand-border"
          />
          {value?.caption ? (
            <figcaption className="text-sm text-brand-dark/70 mt-2">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = (await getArticlesByCategory(article.categorySlug))
    .filter((a) => a.slug !== slug)
    .slice(0, 4);

  const updatedDate = new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Breadcrumb */}
      <div className="bg-brand-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-brand-dark/70">
          <Link href="/" className="hover:text-brand-primary transition-colors">Help Center</Link>
          <ChevronRight size={14} />
          <Link href={`/category/${article.categorySlug}`} className="hover:text-brand-primary transition-colors">
            {article.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-dark truncate">{article.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Article header */}
          <div className="bg-white border border-brand-border rounded-xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href={`/category/${article.categorySlug}`}
                className="text-xs font-semibold text-brand-primary bg-brand-light px-3 py-1 rounded-full border border-brand-border hover:border-brand-primary transition-colors"
              >
                {article.category}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-brand-secondary leading-tight mb-3">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-brand-dark/85 text-base leading-relaxed mb-5">
                {article.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-border text-xs text-brand-dark/70">
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> Updated {updatedDate}
              </span>
              {article.tags?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag size={12} />
                  {article.tags.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Article body */}
          <div className="bg-white border border-brand-border rounded-xl p-8">
            <div className="article-body">
              {Array.isArray(article.content) ? (
                <PortableText value={article.content} components={portableTextComponents} />
              ) : (
                <MDXRemote source={article.content} />
              )}
            </div>
          </div>

          {/* Was this helpful */}
          <div className="mt-6 bg-white border border-brand-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-brand-secondary">Was this article helpful?</p>
            <div className="flex gap-3">
              <button className="btn-ghost text-sm px-5 py-2">👍 Yes, thanks</button>
              <button className="btn-ghost text-sm px-5 py-2">👎 Not really</button>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-4">
            <Link
              href={`/category/${article.categorySlug}`}
              className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-secondary transition-colors font-medium"
            >
              <ArrowLeft size={14} /> Back to {article.category}
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wider mb-3">
                  In this category
                </p>
                <div className="space-y-1">
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-brand-dark hover:bg-white hover:text-brand-primary transition-colors group border border-transparent hover:border-brand-border"
                    >
                      <span className="leading-snug">{a.title}</span>
                      <ArrowRight size={13} className="text-brand-dark/60 group-hover:text-brand-primary shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/category/${article.categorySlug}`}
                  className="block mt-3 text-xs text-brand-primary hover:text-brand-secondary transition-colors font-medium px-3"
                >
                  View all in {article.category} →
                </Link>
              </div>
            )}

            {/* Contact support */}
            <div className="bg-brand-secondary rounded-xl p-5 text-white">
              <p className="text-sm font-semibold mb-1">Still need help?</p>
              <p className="text-xs text-white/60 mb-4">Our support team is available 24/7.</p>
              <a
                href="mailto:support@chively.com"
                className="block text-center bg-brand-accent text-brand-secondary text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Support
              </a>
              <a
                href="tel:+18004398229"
                className="block text-center text-white/70 hover:text-white text-xs mt-3 transition-colors"
              >
                +1 (800) 439-8229
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
