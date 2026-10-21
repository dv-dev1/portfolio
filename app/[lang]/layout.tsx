import type { Metadata, Viewport } from "next";
import { getLocale } from "@/content/i18n";
import { htmlLang, locales, siteUrl } from "@/content/locales";
import { fontMono, fontSans } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Daniel Vieira", template: "%s · Daniel Vieira" },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default async function LayoutRaiz({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={htmlLang[locale]} className={`${fontSans.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
