import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-secondary text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://www.chively.com/wp-content/uploads/2025/10/chively_logo_white.png"
            alt="Chively"
            className="h-6 w-auto opacity-80"
          />
          <span className="text-xs text-white/40">Help Center</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-5 text-xs">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/articles" className="hover:text-white transition-colors">All Articles</Link>
          <a href="https://www.chively.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Chively.com</a>
          <a href="mailto:support@chively.com" className="hover:text-white transition-colors">support@chively.com</a>
          <a href="tel:+18004398229" className="hover:text-white transition-colors">+1 (800) 439-8229</a>
        </nav>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} Chively. All rights reserved.</p>
      </div>
    </footer>
  );
}
