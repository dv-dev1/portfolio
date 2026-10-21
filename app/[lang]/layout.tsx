import type { Metadata, Viewport } from "next";
import { alternates, getLocale, getSite } from "@/content/i18n";
import { htmlLang, locales, siteUrl } from "@/content/locales";
import { fontMono, fontSans } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.meta.titulo, template: "%s · Daniel Vieira" },
    description: site.meta.descricao,
    alternates: alternates(locale, ""),
  };
}

export const viewport: Viewport = { themeColor: "#000000" };

export default async function LayoutRaiz({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={htmlLang[locale]} className={`${fontSans.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
