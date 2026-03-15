import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://debt-payoff-calculator.vercel.app/sitemap.xml",
  };
}
