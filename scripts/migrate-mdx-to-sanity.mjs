import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-24";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const articlesDir = path.join(process.cwd(), "content/articles");

function uid() {
  return Math.random().toString(36).slice(2, 12);
}

function toSpan(text) {
  return {
    _type: "span",
    _key: uid(),
    text,
    marks: [],
  };
}

function toBlock(text, style = "normal") {
  return {
    _type: "block",
    _key: uid(),
    style,
    markDefs: [],
    children: [toSpan(text)],
  };
}

function toListBlock(text, listItem) {
  return {
    _type: "block",
    _key: uid(),
    style: "normal",
    listItem,
    level: 1,
    markDefs: [],
    children: [toSpan(text)],
  };
}

function cleanInlineMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
    .trim();
}

function mdxToPortableText(mdx) {
  const lines = mdx.split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = cleanInlineMd(paragraph.join(" ").trim());
    if (text) blocks.push(toBlock(text));
    paragraph = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      continue;
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith("<div") || line.startsWith("</div>") || line.includes("screenshot-placeholder")) {
      flushParagraph();
      continue;
    }

    if (/^>\s*\[!NOTE\]/i.test(line)) {
      flushParagraph();
      blocks.push(toBlock("Note", "h4"));
      continue;
    }

    if (/^>\s*/.test(line)) {
      flushParagraph();
      blocks.push(toBlock(cleanInlineMd(line.replace(/^>\s*/, "")), "blockquote"));
      continue;
    }

    if (/^####\s+/.test(line)) {
      flushParagraph();
      blocks.push(toBlock(cleanInlineMd(line.replace(/^####\s+/, "")), "h4"));
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushParagraph();
      blocks.push(toBlock(cleanInlineMd(line.replace(/^###\s+/, "")), "h3"));
      continue;
    }

    if (/^##\s+/.test(line)) {
      flushParagraph();
      blocks.push(toBlock(cleanInlineMd(line.replace(/^##\s+/, "")), "h2"));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      blocks.push(toListBlock(cleanInlineMd(line.replace(/^\d+\.\s+/, "")), "number"));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      blocks.push(toListBlock(cleanInlineMd(line.replace(/^[-*]\s+/, "")), "bullet"));
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  if (blocks.length === 0) {
    blocks.push(toBlock("Content imported from existing article."));
  }
  return blocks;
}

async function migrate() {
  if (!fs.existsSync(articlesDir)) {
    console.error("No content/articles directory found.");
    process.exit(1);
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  let imported = 0;

  for (const filename of files) {
    const slug = filename.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(articlesDir, filename), "utf8");
    const { data, content } = matter(raw);

    const categorySlug = data.categorySlug || "getting-started";
    const statusFromTags = Array.isArray(data.tags) && (data.tags.includes("beta") || data.tags.includes("testing")) ? "beta" : "published";

    const doc = {
      _id: `article.${slug}`,
      _type: "article",
      title: data.title || slug,
      slug: { _type: "slug", current: slug },
      description: data.description || "Imported article.",
      category: { _type: "reference", _ref: `category.${categorySlug}` },
      secondaryCategories: [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: data.status || statusFromTags,
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
      body: mdxToPortableText(content),
    };

    await client.createOrReplace(doc);
    imported++;
    console.log(`Upserted ${slug}`);
  }

  console.log(`Migration complete. Imported ${imported} articles.`);
}

migrate().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
