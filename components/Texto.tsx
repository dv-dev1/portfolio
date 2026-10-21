import { Fragment } from "react";
import type { Paragrafo } from "@/content/pt";

export const numero = (i: number) => String(i + 1).padStart(2, "0");

export const textoPuro = (p: Paragrafo) => p.map((t) => (typeof t === "string" ? t : t.hi)).join("");

export function Linhas({ texto }: { texto: string }) {
  return texto.split("\n").map((linha, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {linha}
    </Fragment>
  ));
}

export function Rico({ p }: { p: Paragrafo }) {
  return p.map((t, i) =>
    typeof t === "string" ? (
      <Fragment key={i}>{t}</Fragment>
    ) : (
      <span key={i} className="l-hi">
        {t.hi}
      </span>
    ),
  );
}
