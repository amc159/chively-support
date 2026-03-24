import Link from "next/link";
import {
  Rocket, CreditCard, Monitor, UtensilsCrossed,
  Users, BarChart2, ShoppingBag, Wrench,
  LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/articles";

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  CreditCard,
  Monitor,
  UtensilsCrossed,
  Users,
  BarChart2,
  ShoppingBag,
  Wrench,
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = ICON_MAP[category.icon] ?? Rocket;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col gap-4 p-6 bg-white border border-brand-border rounded-xl
                 hover:border-brand-primary hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-lg bg-brand-light flex items-center justify-center
                        group-hover:bg-brand-primary transition-colors duration-200">
          <Icon
            size={20}
            className="text-brand-primary group-hover:text-white transition-colors duration-200"
          />
        </div>
        <span className="text-xs font-semibold text-brand-secondary bg-brand-accent px-2.5 py-1 rounded-full">
          {category.articleCount} {category.articleCount === 1 ? "article" : "articles"}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-brand-secondary text-[15px] group-hover:text-brand-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-[13px] text-brand-dark/85 mt-1 leading-relaxed">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
