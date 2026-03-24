export const allArticlesQuery = `
*[_type == "article"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  description,
  "category": category->name,
  "categorySlug": category->slug.current,
  tags,
  publishedAt,
  updatedAt,
  body
}
`;

export const articleBySlugQuery = `
*[_type == "article" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  description,
  "category": category->name,
  "categorySlug": category->slug.current,
  tags,
  publishedAt,
  updatedAt,
  body
}
`;

export const categoriesQuery = `
*[_type == "category"] | order(name asc) {
  name,
  "slug": slug.current,
  description,
  icon
}
`;
