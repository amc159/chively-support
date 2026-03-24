"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, FileText, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";
import type { ArticleMeta } from "@/lib/articles";
import Link from "next/link";

interface SearchBarProps {
  articles: ArticleMeta[];
  placeholder?: string;
  size?: "sm" | "lg";
}

export default function SearchBar({
  articles,
  placeholder = "Search articles…",
  size = "lg",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleMeta[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useRef(
    new Fuse(articles, {
      keys: ["title", "description", "tags", "category"],
      threshold: 0.35,
      minMatchCharLength: 2,
    })
  );

  useEffect(() => {
    fuse.current = new Fuse(articles, {
      keys: ["title", "description", "tags", "category"],
      threshold: 0.35,
      minMatchCharLength: 2,
    });
  }, [articles]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (val.length >= 2) {
        const res = fuse.current.search(val).slice(0, 6).map((r) => r.item);
        setResults(res);
        setOpen(true);
      } else {
        setResults([]);
        setOpen(false);
      }
    },
    []
  );

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLg = size === "lg";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 bg-white border rounded-xl shadow-sm transition-all
          ${isLg ? "px-5 py-3.5" : "px-4 py-2.5"}
          ${open ? "border-brand-primary ring-2 ring-brand-primary/10" : "border-brand-border"}
        `}
      >
        <Search
          size={isLg ? 20 : 16}
          className="text-brand-primary shrink-0"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none text-brand-dark placeholder:text-brand-dark/60
            ${isLg ? "text-base" : "text-sm"}`}
        />
        {query && (
          <button onClick={clear} className="text-brand-border hover:text-brand-dark transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2.5 border-b border-brand-border text-xs text-brand-dark/60 font-semibold uppercase tracking-wider">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </div>
              <ul>
                {results.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/articles/${article.slug}`}
                      onClick={clear}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-brand-light transition-colors group"
                    >
                      <FileText size={16} className="text-brand-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-secondary group-hover:text-brand-primary transition-colors truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-brand-dark/60 mt-0.5 truncate">{article.category}</p>
                      </div>
                      <ArrowRight size={14} className="text-brand-dark/35 group-hover:text-brand-primary transition-colors mt-0.5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-brand-border">No results for <span className="font-medium text-brand-dark">{`"${query}"`}</span></p>
              <p className="text-xs text-brand-border mt-1">Try a different keyword or browse categories below.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
