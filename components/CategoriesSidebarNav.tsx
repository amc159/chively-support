"use client";

import { useEffect, useState } from "react";

type SidebarCategory = {
  slug: string;
  name: string;
  articleCount: number;
};

type Props = {
  categories: SidebarCategory[];
};

export default function CategoriesSidebarNav({ categories }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug ?? "");

  useEffect(() => {
    if (categories.length === 0) return;

    const hashSlug = window.location.hash.replace("#", "");
    if (hashSlug && categories.some((c) => c.slug === hashSlug)) {
      setActiveSlug(hashSlug);
    }

    const sections = categories
      .map((c) => document.getElementById(c.slug))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) setActiveSlug(id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.4, 0.7],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="sticky top-24 space-y-1">
      <p className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wider mb-3">Categories</p>
      {categories.map((cat) => {
        const isActive = cat.slug === activeSlug;
        return (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            onClick={() => setActiveSlug(cat.slug)}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
              ${isActive
                ? "bg-brand-primary text-white font-medium"
                : "text-brand-dark hover:bg-white hover:text-brand-primary"
              }`}
          >
            <span>{cat.name}</span>
            <span className={`text-xs ${isActive ? "text-white/70" : "text-brand-dark/45 group-hover:text-brand-primary/80"}`}>
              {cat.articleCount}
            </span>
          </a>
        );
      })}
    </div>
  );
}
