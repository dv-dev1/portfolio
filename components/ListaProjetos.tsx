"use client";

import { useState, type ReactNode } from "react";
import type { Area, Project, Site } from "@/content/pt";
import { numero } from "./Texto";

export type Linha = Project & { href?: string };

type Props = { lista: Linha[]; filtros: Site["projetos"]["filtros"]; rotulo: string; children: ReactNode };

function Conteudo({ p, i }: { p: Linha; i: number }) {
  return (
    <>
      <span className="l-mono l-dim">{numero(i)}</span>
      <span className="l-t l-rn">{p.nome}</span>
      <span className="l-rd">{p.desc}</span>
      <span className="l-tags">
        {p.stack.map((s) => (
          <span key={s} className="l-tag">
            {s}
          </span>
        ))}
      </span>
      <span className="l-mono l-selo">
        {p.selo}
        <br />
        <span className="l-dim">{p.ano}</span>
      </span>
      <span className="l-arrow" aria-hidden="true">
        {p.href ? "→" : ""}
      </span>
    </>
  );
}

export function ListaProjetos({ lista, filtros, rotulo, children }: Props) {
  const [area, setArea] = useState<Area | "todos">("todos");
  const visiveis = area === "todos" ? lista : lista.filter((p) => p.area === area);
  const quantos = (id: Area | "todos") => (id === "todos" ? lista.length : lista.filter((p) => p.area === id).length);

  return (
    <>
      <div className="l-head l-proj-head">
        {children}
        <div className="l-chips" role="group" aria-label={rotulo}>
          {filtros.map((f) => (
            <button key={f.id} type="button" className="l-chip" aria-pressed={area === f.id} onClick={() => setArea(f.id)}>
              {f.rotulo} <small>{quantos(f.id)}</small>
            </button>
          ))}
        </div>
      </div>
      <ol className="l-list">
        {visiveis.map((p, i) => (
          <li key={p.slug} data-area={p.area}>
            {/* R11: trabalho de empresa não tem link; vira div com o mesmo grid. */}
            {p.href ? (
              <a className="l-row" href={p.href}>
                <Conteudo p={p} i={i} />
              </a>
            ) : (
              <div className="l-row">
                <Conteudo p={p} i={i} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
