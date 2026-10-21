import { Casca } from "@/components/Casca";
import { CopiarEmail, EmailLink } from "@/components/Email";
import { Relogio } from "@/components/Relogio";
import { Linhas, Rico, numero } from "@/components/Texto";
import { TraceAoVivo } from "@/components/TraceAoVivo";
import { destino, getLocale, getSite } from "@/content/i18n";
import { perfis } from "@/content/locales";

export default async function Inicio() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const t = site.inicio;
  const destaques = t.destaques.flatMap((d) => {
    const p = site.projetos.lista.find((x) => x.slug === d.slug);
    return p ? [{ ...d, nome: p.nome, href: destino(p, locale), caso: p.slug === site.caso.slug }] : [];
  });

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

        <section className="l-wrap l-sec" aria-labelledby="h-num">
          <h2 id="h-num" className="l-mono l-label">
            {t.medido}
          </h2>
          <ul className="l-nums">
            {t.numeros.map((n) => (
              <li key={n.n}>
                <span className="l-t l-num">{n.n}</span>
                <span className="l-nl">{n.texto}</span>
                <span className="l-mono l-dim">{n.nota}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="projetos" className="l-wrap l-sec">
          <div className="l-head">
            <h2 className="l-t l-h2">
              <Linhas texto={t.selecionados} />
            </h2>
            <a className="l-link l-mono l-mais" href={`/${locale}/projects/`}>
              {t.todos}
            </a>
          </div>
          <div className="l-cards">
            {destaques.map((d, i) => (
              <a key={d.slug} className="l-card" href={d.href}>
                <span className="l-ctop l-mono">
                  <span>{numero(i)}</span>
                  <span>{d.selo}</span>
                </span>
                <span className="l-t l-ct">{d.nome}</span>
                <span className="l-cd">{d.desc}</span>
                <span className="l-tags">
                  {d.stack.map((s) => (
                    <span key={s} className="l-tag">
                      {s}
                    </span>
                  ))}
                </span>
                <span className="l-mono l-cta">{d.caso ? site.ui.lerCaso : site.ui.verProjeto}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="caminho" className="l-wrap l-sec">
          <div className="l-head">
            <h2 className="l-t l-h2">
              <Linhas texto={t.caminho.titulo} />
            </h2>
            <p className="l-caminho-texto">{t.caminho.texto}</p>
          </div>
          <TraceAoVivo textos={t.caminho} commit={process.env.COMMIT ?? "local"} />
        </section>
      </main>

      <footer id="contato" className="l-foot l-foot-contato">
        <div className="l-wrap">
          <h2 className="l-t l-contato-t">
            <Linhas texto={t.contato.titulo} />
          </h2>
          <div className="l-contact">
            <EmailLink antes={t.contato.emailAntes} />
            <CopiarEmail rotulos={{ copiar: t.contato.copiar, copiado: t.contato.copiado, falhou: t.contato.falhou }} />
          </div>
          <a className="l-contact" href={perfis.linkedin}>
            <span className="l-cv">in/dv-dev</span>
            <span className="l-mono">linkedin ↗</span>
          </a>
          <a className="l-contact l-contact-fim" href={perfis.github}>
            <span className="l-cv">dv-dev1</span>
            <span className="l-mono">github ↗</span>
          </a>
          <div className="l-colophon l-mono">
            <span>{site.ui.copyright}</span>
            <span>{t.contato.stack}</span>
            <a className="l-link" href="#topo">
              {t.contato.topo}
            </a>
          </div>
        </div>
      </footer>
    </Casca>
  );
}
