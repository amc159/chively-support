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

const categories = [
  {
    name: "Getting Started",
    slug: "getting-started",
    description: "Set up your Chively POS system and go live fast.",
    icon: "Rocket",
  },
  {
    name: "Payments & Processing",
    slug: "payments",
    description: "Rates, funding timelines, surcharging, and payment splits.",
    icon: "CreditCard",
  },
  {
    name: "Hardware & Equipment",
    slug: "hardware",
    description: "POS devices, printers, scanners, and peripherals.",
    icon: "Monitor",
  },
  {
    name: "Menu & Orders",
    slug: "menu-orders",
    description: "Build menus, modifiers, KDS routing, and order flow.",
    icon: "UtensilsCrossed",
  },
  {
    name: "Staff & Permissions",
    slug: "staff",
    description: "Roles, time clock, permissions, and manager controls.",
    icon: "Users",
  },
  {
    name: "Reports & Analytics",
    slug: "reports",
    description: "Sales reports, exports, real-time dashboards, and insights.",
    icon: "BarChart2",
  },
  {
    name: "Online Ordering & Delivery",
    slug: "online-ordering",
    description: "Online ordering setup and third-party delivery integrations.",
    icon: "ShoppingBag",
  },
  {
    name: "Troubleshooting",
    slug: "troubleshooting",
    description: "Common issues, error fixes, and offline mode guidance.",
    icon: "Wrench",
  },
];

async function seedCategories() {
  for (const category of categories) {
    const id = `category.${category.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "category",
      ...category,
      slug: { _type: "slug", current: category.slug },
    });
    console.log(`Upserted ${category.name}`);
  }
}

seedCategories()
  .then(() => {
    console.log("Sanity categories seeded successfully.");
  })
  .catch((error) => {
    console.error("Failed to seed categories:", error.message);
    process.exit(1);
  });
