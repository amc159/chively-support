"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-white border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="https://www.chively.com/wp-content/uploads/2025/10/chively_logo_dark_color.png"
            alt="Chively"
            width={140}
            height={28}
            className="h-7 w-auto"
            priority
          />
          <span className="text-sm font-medium text-brand-dark/85 group-hover:text-brand-primary transition-colors hidden sm:block">
            Help Center
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-brand-dark">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <Link href="/articles" className="hover:text-brand-primary transition-colors">All Articles</Link>
          <a
            href="https://www.chively.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-brand-primary transition-colors"
          >
            Chively.com <ExternalLink size={13} />
          </a>
          <a href="mailto:support@chively.com" className="btn-primary">
            Contact Support
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-brand-dark hover:text-brand-primary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-border bg-brand-white px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm text-brand-dark hover:text-brand-primary py-1" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/articles" className="block text-sm text-brand-dark hover:text-brand-primary py-1" onClick={() => setOpen(false)}>All Articles</Link>
          <a href="https://www.chively.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-dark hover:text-brand-primary py-1">Chively.com</a>
          <a href="mailto:support@chively.com" className="btn-primary inline-block mt-2">Contact Support</a>
        </div>
      )}
    </header>
  );
}
