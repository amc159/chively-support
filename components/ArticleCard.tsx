import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex items-start justify-between gap-4 py-4
                 hover:bg-brand-accent/25 -mx-4 px-4 transition-colors duration-150"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-medium text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-[13px] text-brand-dark/85 mt-1 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Clock size={11} className="text-brand-dark/85" />
          <span className="text-[11px] text-brand-dark/85">{date}</span>
          {article.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-brand-light text-brand-primary px-2 py-0.5 rounded-full border border-brand-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-brand-border group-hover:text-brand-primary transition-colors mt-1 shrink-0"
      />
    </Link>
  );
}
