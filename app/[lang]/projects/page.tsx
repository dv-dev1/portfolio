import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { ListaProjetos } from "@/components/ListaProjetos";
import { Rico } from "@/components/Texto";
import { alternates, destino, getLocale, getSite } from "@/content/i18n";
import { perfis } from "@/content/locales";

export async function generateMetadata(): Promise<Metadata> {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  return { title: site.projetos.titulo, alternates: alternates(locale, "projects/") };
}

export default async function Projetos() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const t = site.projetos;
  const lista = t.lista.map((p) => ({ ...p, href: destino(p, locale) }));

  return (
    <Casca locale={locale} site={site} pagina="projetos" rota="projects/">
      <main className="l-wrap l-topo">
        <p className="l-mono l-dim l-eyebrow">{t.eyebrow.replace("{n}", String(t.lista.length))}</p>
        <h1 className="l-t l-h1">{t.titulo}</h1>
        <ListaProjetos lista={lista} filtros={t.filtros} rotulo={t.filtroRotulo}>
          <p className="l-lead">
            <Rico p={t.lead} />
          </p>
        </ListaProjetos>
      </main>
      <footer className="l-foot">
        <div className="l-wrap l-colophon l-mono">
          <span>{site.ui.copyright}</span>
          <a className="l-link" href={perfis.github}>
            {t.github}
          </a>
          <a className="l-link" href={`/${locale}/#contato`}>
            {site.ui.contatoLink}
          </a>
        </div>
      </footer>
    </Casca>
  );
}
