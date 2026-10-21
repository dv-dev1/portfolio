import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { Rico } from "@/components/Texto";
import { alternates, getLocale, getSite } from "@/content/i18n";
import { perfis } from "@/content/locales";

export async function generateMetadata(): Promise<Metadata> {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  return { title: site.sobre.titulo, alternates: alternates(locale, "about/") };
}

export default async function Sobre() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const s = site.sobre;

  return (
    <Casca locale={locale} site={site} pagina="sobre" rota="about/">
      <main>
        <section className="l-wrap l-topo">
          <p className="l-mono l-dim l-eyebrow">{s.eyebrow}</p>
          <h1 className="l-t l-h1">{s.titulo}</h1>
          <div className="l-intro">
            <div className="l-intro-texto">
              {s.paragrafos.map((p, i) => (
                <p key={i} className="l-p">
                  <Rico p={p} />
                </p>
              ))}
              <div className="l-acoes">
                <a className="l-btn" href={perfis.linkedin}>
                  {s.linkedin}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="l-wrap l-sec" aria-labelledby="h-traj">
          <h2 id="h-traj" className="l-t l-h2">
            {s.trajetoria}
          </h2>
          <ol className="l-traj">
            {s.empregos.map((j, i) => (
              <li key={j.org} className="l-job">
                <span className="l-when l-mono">{j.quando}</span>
                <span className="l-dot" style={{ animationDelay: `${(i * 1.1).toFixed(1)}s` }} aria-hidden="true" />
                <div>
                  <h3 className="l-t l-org">{j.org}</h3>
                  <p className="l-role l-mono l-dim">{j.papel}</p>
                  <ul className="l-bul">
                    {j.itens.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="l-wrap l-ferramentas" aria-labelledby="h-stack">
          <h2 id="h-stack" className="l-t l-h2">
            {s.ferramentas}
          </h2>
          <div className="l-stack">
            {s.stack.map((g) => (
              <div key={g.nome} className="l-group">
                <h3 className="l-mono l-dim">{g.nome}</h3>
                <div className="l-tags">
                  {g.itens.map((it) => (
                    <span key={it} className="l-tag">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="l-wrap l-sec" aria-label={s.colunasRotulo}>
          <div className="l-cols">
            {s.colunas.map((c) => (
              <div key={c.titulo} className="l-col">
                <h3 className="l-mono l-dim">{c.titulo}</h3>
                {c.itens.map((it) => (
                  <p key={it.k} className="l-item">
                    <b>{it.k}</b>
                    {it.v}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <div className="l-wrap">
          <a className="l-convite" href={`/${locale}/#contato`}>
            <span className="l-t l-convite-t">{s.convite}</span>
            <span className="l-mono l-dim">{s.conviteNota}</span>
          </a>
        </div>
      </main>
      <footer className="l-wrap l-colophon l-mono l-pe">
        <span>{site.ui.copyright}</span>
        <a className="l-link" href="#h-traj">
          {s.voltar}
        </a>
      </footer>
    </Casca>
  );
}
