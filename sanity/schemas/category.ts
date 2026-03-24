import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "icon",
      title: "Icon (Lucide name)",
      type: "string",
      description: "Examples: Rocket, CreditCard, Monitor, UtensilsCrossed, Users, BarChart2, ShoppingBag, Wrench",
      initialValue: "Rocket",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
    },
  },
});
