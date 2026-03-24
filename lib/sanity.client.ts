import { createClient } from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const hasSanityConfig = Boolean(sanityProjectId && sanityDataset);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId: sanityProjectId!,
      dataset: sanityDataset!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-24",
      useCdn: false,
    })
  : null;
