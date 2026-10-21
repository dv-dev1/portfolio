"use client";

import { useState } from "react";
import type { LinhaTerminal, TextosDemo } from "@/content/pt";

const atraso = (s: number) => ({ animationDelay: `${s.toFixed(2)}s` });

function Saida({ linhas, base }: { linhas: LinhaTerminal[]; base: number }) {
  return linhas.map((l, i) => (
    <span key={i} className={`l-tl ${l.c}`} style={atraso(base + i * 0.38)}>
      {l.t}
    </span>
  ));
}

export function DemoAgentgraph({ textos }: { textos: TextosDemo }) {
  const [aprovado, setAprovado] = useState(false);
  const ultimo = textos.nos.length - 1;
  // Pausado no penúltimo nó, o feixe percorreu 6 dos 7 trechos entre os 8 nós.
  const progresso = aprovado ? "100%" : `${(((ultimo - 1) / ultimo) * 100).toFixed(1)}%`;

  return (
    <>
      <div className="l-graph">
        <div className="l-gline">
          <span className="l-gprog" style={{ width: progresso }} />
        </div>
        <ol className="l-gnodes">
          {textos.nos.map((nome, i) => {
            const pausa = !aprovado && i === ultimo - 1;
            const espera = !aprovado && i === ultimo;
            const depois = aprovado && i >= ultimo - 1;
            return (
              <li key={i} className="l-gn">
                <span
                  className={`l-gd ${pausa ? "pausa" : espera ? "" : "feito"}`}
                  style={atraso(depois ? 0.15 + (i - ultimo + 1) * 0.45 : 0.3 + i * 0.38)}
                />
                <span className="l-gtxt">
                  <span className="l-gl">{nome}</span>
                  <span className="l-gs">{pausa ? textos.pausado : espera ? textos.esperando : textos.ok}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="l-term" role="log" aria-label={textos.rotuloLog}>
        <Saida linhas={textos.run} base={0.1} />
        {aprovado && <Saida linhas={textos.resume} base={0.05} />}
      </div>
      <div className="l-demo-acoes">
        <button type="button" className="l-btn l-btn-mono" onClick={() => setAprovado(!aprovado)}>
          {aprovado ? textos.deNovo : textos.aprovar}
        </button>
        <span className="l-mono l-dim">{aprovado ? textos.notaDeNovo : textos.notaAprovar}</span>
      </div>
    </>
  );
}
