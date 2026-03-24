import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (H1)",
      type: "string",
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 120 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description (Excerpt)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(20).max(240),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title (SEO, optional)",
      type: "string",
      description: "If empty, the article Title (H1) will be used automatically.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description (SEO, optional)",
      type: "text",
      rows: 3,
      description: "If empty, the Short Description (Excerpt) will be used automatically.",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "category",
      title: "Primary Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required().error("At least one category is required."),
    }),
    defineField({
      name: "secondaryCategories",
      title: "Secondary Categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Beta", value: "beta" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Article Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).error("Article body content is required."),
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.name",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      return {
        title,
        subtitle: `${subtitle ?? "Uncategorized"} · ${status ?? "draft"}`,
      };
    },
  },
});
