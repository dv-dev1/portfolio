import { lang } from "next/root-params";
import { site as en } from "./en";
import { htmlLang, locales, type Locale } from "./locales";
import { site as pt, type Project, type Site } from "./pt";

const sites: Record<Locale, Site> = { pt, en };

// O layout só gera pt e en (dynamicParams = false), então o valor já é um Locale.
export async function getLocale(): Promise<Locale> {
  return (await lang()) as Locale;
}

export async function getSite(): Promise<Site> {
  return sites[await getLocale()];
}

// R10 e R11: caso abre a página do caso; sem caso, o site no ar ou o repositório; trabalho de empresa não tem link.
export function destino(p: Project, locale: Locale): string | undefined {
  return p.slug === pt.caso.slug ? `/${locale}/projects/${p.slug}/` : (p.site ?? p.repo);
}

export function alternates(locale: Locale, rota: string) {
  return {
    canonical: `/${locale}/${rota}`,
    // Robô de busca não manda idioma e a raiz sem idioma cai em /en/, então o inglês é o padrão.
    languages: { ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}/${rota}`])), "x-default": `/en/${rota}` },
  };
}
