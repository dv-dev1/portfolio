import { Casca } from "@/components/Casca";
import { Relogio } from "@/components/Relogio";
import { Linhas, Rico } from "@/components/Texto";
import { getLocale, getSite } from "@/content/i18n";

export default async function Inicio() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const t = site.inicio;

  return (
    <Casca locale={locale} site={site} pagina="inicio" rota="">
      <main className="p-inicio">
        <section id="topo" className="l-wrap l-hero">
          <p className="l-mono l-dim l-eyebrow">{t.eyebrow}</p>
          <h1 className="l-t l-h1 l-acende">
            <Linhas texto={t.titulo} />
          </h1>
          <div className="l-hero-pe">
            <p className="l-lead">
              <Rico p={t.lead} />
            </p>
            <div className="l-acoes">
              <a className="l-btn" href={`/${locale}/projects/`}>
                {t.verProjetos}
              </a>
              <a className="l-btn" href="#caminho">
                {t.seguirFeixe}
              </a>
            </div>
          </div>
          <dl className="l-now l-mono">
            {t.agora.map((a) => (
              <div key={a.k}>
                <dt>{a.k}</dt>
                <dd>{a.v}</dd>
              </div>
            ))}
            <div className="l-now-hora">
              <dt>{t.cidade}</dt>
              <dd>
                <Relogio /> · {t.fuso}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </Casca>
  );
}
