import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { DemoAgentgraph } from "@/components/DemoAgentgraph";
import { Rico, numero, textoPuro } from "@/components/Texto";
import { alternates, destino, getLocale, getSite } from "@/content/i18n";
import { site as pt, type Rotulado } from "@/content/pt";

export const dynamicParams = false;

// Só o agentgraph tem caso escrito (fora de escopo: outros casos); os demais projetos levam ao repo ou ao site.
export function generateStaticParams() {
  return [{ slug: pt.caso.slug }];
}

export async function generateMetadata(): Promise<Metadata> {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  return {
    title: site.caso.titulo,
    description: textoPuro(site.caso.lead),
    alternates: alternates(locale, `projects/${site.caso.slug}/`),
  };
}

function Titulo({ n, id, children }: { n: number; id?: string; children: string }) {
  return (
    <div className="l-sh">
      <span className="l-mono l-dim">{numero(n)}</span>
      <h2 id={id} className="l-t l-h2">
        {children}
      </h2>
    </div>
  );
}

function Tabela({ linhas }: { linhas: Rotulado[] }) {
  return (
    <table className="l-tab">
      <tbody>
        {linhas.map((l) => (
          <tr key={l.k}>
            <th scope="row">{l.k}</th>
            <td>{l.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Codigo({ linhas }: { linhas: string[] }) {
  return (
    <div className="l-code">
      {linhas.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

export default async function Caso() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const c = site.caso;
  const lista = site.projetos.lista;
  const i = lista.findIndex((p) => p.slug === c.slug);
  const projeto = lista[i];
  const proximo = lista.slice(i + 1).find((p) => destino(p, locale));

  return (
    <Casca locale={locale} site={site} pagina="caso" rota={`projects/${c.slug}/`}>
      <main className="p-caso">
        <article>
          <section className="l-wrap l-topo">
            <nav aria-label={c.trilhaRotulo} className="l-mono l-dim l-trilha">
              <a className="l-link" href={`/${locale}/#projetos`}>
                {c.trilha}
              </a>{" "}
              / {c.titulo}
            </nav>
            <h1 className="l-t l-h1">{c.titulo}</h1>
            <p className="l-p l-caso-lead">
              <Rico p={c.lead} />
            </p>
            <dl className="l-meta l-mono">
              {c.meta.map((m) => (
                <div key={m.k}>
                  <dt>{m.k}</dt>
                  <dd>{m.v}</dd>
                </div>
              ))}
              <div>
                <dt>{c.codigo}</dt>
                <dd>
                  <a className="l-link" href={projeto.repo}>
                    {projeto.repo?.replace("https://", "")} ↗
                  </a>
                </dd>
              </div>
            </dl>
            <ul className="l-facts">
              {c.fatos.map((f) => (
                <li key={f.k}>
                  <span className="l-t l-fn">{f.k}</span>
                  <span>{f.v}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="l-wrap l-sec">
            <div className="l-narrow">
              <Titulo n={0}>{c.problema.titulo}</Titulo>
              {c.problema.paragrafos.map((p, k) => (
                <p key={k} className="l-p">
                  <Rico p={p} />
                </p>
              ))}
              <p className="l-quote">{c.problema.citacao}</p>
            </div>
          </section>

          <section className="l-wrap l-sec" aria-labelledby="h-rodar">
            <Titulo n={1} id="h-rodar">
              {c.rodar.titulo}
            </Titulo>
            <p className="l-p l-caso-intro">
              <Rico p={c.rodar.texto} />
            </p>
            <DemoAgentgraph textos={c.rodar.demo} />
          </section>

          <section className="l-wrap l-sec">
            <div className="l-narrow">
              <Titulo n={2}>{c.funciona.titulo}</Titulo>
              <p className="l-p">{c.funciona.intro}</p>
              <Tabela linhas={c.funciona.arquivos} />
              <p className="l-p">
                <Rico p={c.funciona.no} />
              </p>
              <Codigo linhas={c.funciona.codNo} />
              <p className="l-p">
                <Rico p={c.funciona.humano} />
              </p>
              <Codigo linhas={c.funciona.codHumano} />
            </div>
          </section>

          <section className="l-wrap l-sec">
            <div className="l-narrow">
              <Titulo n={3}>{c.armadilha.titulo}</Titulo>
              <p className="l-warn">{c.armadilha.aviso}</p>
              <Codigo linhas={c.armadilha.codRuim} />
              <p className="l-p">
                <Rico p={c.armadilha.texto} />
              </p>
            </div>
          </section>

          <section className="l-wrap l-sec">
            <div className="l-narrow">
              <Titulo n={4}>{c.naoE.titulo}</Titulo>
              <Tabela linhas={c.naoE.linhas} />
            </div>
          </section>

          <nav aria-label={c.outros} className="l-wrap">
            <div className="l-next">
              <a className="l-nx" href={`/${locale}/#projetos`}>
                <span className="l-mono l-dim">{c.voltar}</span>
                <span className="l-t l-nxt">{c.todos}</span>
              </a>
              {proximo && (
                <a className="l-nx l-nx-dir" href={destino(proximo, locale)}>
                  <span className="l-mono l-dim">{c.proximo}</span>
                  <span className="l-t l-nxt">{proximo.nome}</span>
                </a>
              )}
            </div>
          </nav>
        </article>
      </main>
      <footer className="l-wrap l-colophon l-mono l-pe">
        <span>{site.ui.copyright}</span>
        <a className="l-link" href={`/${locale}/#contato`}>
          {site.ui.contatoLink}
        </a>
      </footer>
    </Casca>
  );
}
