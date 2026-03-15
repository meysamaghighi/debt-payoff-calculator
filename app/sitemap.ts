import type { MetadataRoute } from "next";
import { debtTypes } from "./lib/debt-engine";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://debt-payoff-calculator.vercel.app";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...debtTypes.map((dt) => ({
      url: `${base}/${dt.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
