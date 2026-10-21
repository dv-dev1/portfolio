"use client";

import { useEffect, useState } from "react";
import type { TextosCaminho } from "@/content/pt";

type Trace = { colo: string; http: string; loc: string; tls: string };
type Fase = "lendo" | "vivo" | "exemplo";

const EXEMPLO: Trace = { colo: "GRU", http: "http/3", loc: "BR", tls: "TLSv1.3" };
const CAMPOS = ["colo", "http", "loc", "tls"] as const;

export function lerTrace(texto: string): Trace | null {
  const campo = (k: string) => new RegExp(`^${k}=(.+)$`, "m").exec(texto)?.[1].trim();
  const colo = campo("colo");
  // Um 200 que não é trace (fallback HTML, proxy) não traz colo de três letras.
  if (!colo || !/^[A-Z]{3}$/.test(colo)) return null;
  return { colo, http: campo("http") || EXEMPLO.http, loc: campo("loc") || EXEMPLO.loc, tls: campo("tls") || EXEMPLO.tls };
}

export function TraceAoVivo({ textos, commit }: { textos: TextosCaminho; commit: string }) {
  const [estado, setEstado] = useState<{ fase: Fase; trace: Trace }>({ fase: "lendo", trace: EXEMPLO });

  useEffect(() => {
    const controle = new AbortController();
    fetch("/cdn-cgi/trace", { cache: "no-store", signal: controle.signal })
      .then((r) => (r.ok ? r.text() : ""))
      .then((texto) => {
        const trace = lerTrace(texto);
        setEstado(trace ? { fase: "vivo", trace } : { fase: "exemplo", trace: EXEMPLO });
      })
      .catch(() => {
        if (!controle.signal.aborted) setEstado({ fase: "exemplo", trace: EXEMPLO });
      });
    return () => controle.abort();
  }, []);

  const { fase, trace } = estado;
  const rotulo = fase === "vivo" ? textos.aoVivo : textos.exemplo;
  const valores: Record<string, string> = { commit, ...trace };
  const preencher = (v: string) => v.replace(/\{(\w+)\}/g, (_, k: string) => valores[k] ?? "");

  return (
    <>
      <div className="l-trilho">
        <div className="l-rail">
          <span className="l-beam" />
        </div>
        <ol className="l-stations">
          {textos.estacoes.map((s, i) => {
            const atraso = { animationDelay: `${(i * 0.7).toFixed(1)}s` };
            return (
              <li key={s.k} className="l-station">
                <span className="l-st" style={atraso} aria-hidden="true" />
                <span className="l-sttxt">
                  <span className="l-k" style={atraso}>
                    {s.k}
                  </span>
                  <span className="l-v">{preencher(s.v)}</span>
                  {/\{(colo|http|tls|loc)\}/.test(s.v) && <span className="l-live">{rotulo}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="l-trace-linha" data-trace={fase}>
        <div className="l-trace-sobre">
          <p className="l-mono l-dim">GET /cdn-cgi/trace · {rotulo}</p>
          <p>{textos.traceTexto}</p>
        </div>
        <div className="l-trace l-mono" key={fase === "vivo" ? "vivo" : "base"}>
          {CAMPOS.map((k, i) => (
            <span key={k} className="l-tl" style={{ animationDelay: `${(0.4 + i * 0.32).toFixed(2)}s` }}>
              <span className="l-dim">{k}=</span>
              <span className="l-tv">{trace[k]}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
