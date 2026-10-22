import Image from "next/image";
import { Casca } from "@/components/Casca";
import { CopiarEmail, EmailLink } from "@/components/Email";
import { ListaProjetos } from "@/components/ListaProjetos";
import { Relogio } from "@/components/Relogio";
import { SecaoAtiva } from "@/components/SecaoAtiva";
import { Linhas, Rico, numero } from "@/components/Texto";
import { TraceAoVivo } from "@/components/TraceAoVivo";
import foto from "@/content/foto.webp";
import { destino, getLocale, getSite } from "@/content/i18n";
import { perfis } from "@/content/locales";

export default async function Inicio() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const t = site.inicio;
  const proj = site.projetos;
  const s = site.sobre;
  const destaques = t.destaques.flatMap((d) => {
    const p = site.projetos.lista.find((x) => x.slug === d.slug);
    return p ? [{ ...d, nome: p.nome, href: destino(p, locale), caso: p.slug === site.caso.slug }] : [];
  });
  const lista = proj.lista.map((x) => ({ ...x, href: destino(x, locale) }));

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
              <a className="l-btn" href="#projetos">
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
            <a className="l-link l-mono l-mais" href="#lista">
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
          <div id="lista" className="l-todos">
            <p className="l-mono l-dim l-eyebrow">{proj.eyebrow.replace("{n}", String(proj.lista.length))}</p>
            <ListaProjetos lista={lista} filtros={proj.filtros} rotulo={proj.filtroRotulo}>
              <p className="l-lead">
                <Rico p={proj.lead} />
              </p>
            </ListaProjetos>
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

        <section id="sobre" aria-labelledby="h-sobre">
          <div className="l-wrap l-sec">
            <p className="l-mono l-dim l-eyebrow">{s.eyebrow}</p>
            <h2 id="h-sobre" className="l-t l-h2">
              {s.titulo}
            </h2>
            <div className="l-intro">
              <div className="l-intro-texto">
                {s.paragrafos.map((par, i) => (
                  <p key={i} className="l-p">
                    <Rico p={par} />
                  </p>
                ))}
                <div className="l-acoes">
                  <a className="l-btn" href={perfis.linkedin}>
                    {s.linkedin}
                  </a>
                </div>
              </div>
              <Image className="l-foto" src={foto} alt={s.fotoAlt} />
            </div>
          </div>

          <section className="l-wrap l-sec" aria-labelledby="h-traj">
            <h3 id="h-traj" className="l-t l-h2">
              {s.trajetoria}
            </h3>
            <ol className="l-traj">
              {s.empregos.map((j, i) => (
                <li key={j.org} className="l-job">
                  <span className="l-when l-mono">{j.quando}</span>
                  <span className="l-dot" style={{ animationDelay: `${(i * 1.1).toFixed(1)}s` }} aria-hidden="true" />
                  <div>
                    <h4 className="l-t l-org">{j.org}</h4>
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
            <h3 id="h-stack" className="l-t l-h2">
              {s.ferramentas}
            </h3>
            <div className="l-stack">
              {s.stack.map((g) => (
                <div key={g.nome} className="l-group">
                  <h4 className="l-mono l-dim">{g.nome}</h4>
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
                  <h4 className="l-mono l-dim">{c.titulo}</h4>
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
      <SecaoAtiva />
    </Casca>
  );
}
