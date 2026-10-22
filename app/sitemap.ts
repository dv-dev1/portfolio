import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/content/locales";
import { site } from "@/content/pt";

export const dynamic = "force-static";

const rotas = ["", `projects/${site.caso.slug}/`];

export default function sitemap(): MetadataRoute.Sitemap {
  return rotas.flatMap((rota) => locales.map((l) => ({ url: `${siteUrl}/${l}/${rota}` })));
}
