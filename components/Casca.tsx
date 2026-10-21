import { Fragment, type ReactNode } from "react";
import { htmlLang, locales, type Locale } from "@/content/locales";
import type { Site } from "@/content/pt";
import { Lanterna } from "./Lanterna";
import { MenuCelular } from "./MenuCelular";
import { numero } from "./Texto";

type Pagina = "inicio" | "projetos" | "sobre" | "404";

type Props = {
  locale: Locale;
  site: Site;
  pagina: Pagina;
  rota: string;
  animacao?: "l-sweep" | "l-busca";
  children: ReactNode;
};

function Idiomas({ locale, rota, rotulo }: { locale: Locale; rota: string; rotulo: string }) {
  return (
    <div className="l-lang l-mono" role="group" aria-label={rotulo}>
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span className="l-dim" aria-hidden="true">
              /
            </span>
          )}
          {l === locale ? (
            <span aria-current="true">{l}</span>
          ) : (
            <a href={`/${l}/${rota}`} hrefLang={htmlLang[l]} lang={htmlLang[l]}>
              {l}
            </a>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function Casca({ locale, site, pagina, rota, animacao = "l-sweep", children }: Props) {
  const { ui } = site;
  const links = [
    { id: "inicio", rotulo: ui.inicio, href: `/${locale}/` },
    { id: "projetos", rotulo: ui.projetos, href: `/${locale}/projects/` },
    { id: "sobre", rotulo: ui.sobre, href: `/${locale}/about/` },
    // O contato mora no rodapé do Início: lá é âncora local, nas outras páginas leva ao Início.
    { id: "contato", rotulo: ui.contato, href: pagina === "inicio" ? "#contato" : `/${locale}/#contato` },
  ];
  const atual = (id: string) => (id === pagina ? "page" : undefined);

  return (
    <>
      <header className="l-wrap l-nav">
        <a href={`/${locale}/`} className="l-link l-mono l-marca">
          daniel vieira
        </a>
        <nav aria-label={ui.navegacao} className="l-nav-links">
          {links.map((l) => (
            <a key={l.id} className="l-link" href={l.href} aria-current={atual(l.id)}>
              {l.rotulo}
            </a>
          ))}
        </nav>
        <Idiomas locale={locale} rota={rota} rotulo={ui.idioma} />
        <MenuCelular rotulo={ui.menu} fechar={ui.fechar} marca="daniel vieira">
          <nav aria-label={ui.navegacao} className="l-sheet-nav">
            {links.map((l, i) => (
              <a key={l.id} className="l-big" href={l.href} aria-current={atual(l.id)}>
                {l.rotulo} <span className="l-mono l-dim">{numero(i)}</span>
              </a>
            ))}
          </nav>
          <div className="l-sheet-pe">
            <Idiomas locale={locale} rota={rota} rotulo={ui.idioma} />
            <span className="l-mono l-dim">{ui.coordenadas}</span>
          </div>
        </MenuCelular>
      </header>
      {children}
      <Lanterna animacao={animacao} />
    </>
  );
}
