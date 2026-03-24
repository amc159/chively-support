"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 bg-brand-light">
      <div className="rounded-xl overflow-hidden border border-brand-border bg-white">
        <NextStudio config={config} />
      </div>
    </div>
  );
}
