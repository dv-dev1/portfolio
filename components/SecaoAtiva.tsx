"use client";

import { useEffect } from "react";

export function SecaoAtiva() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];
    const secoes = [...new Set(links.map((a) => a.hash.slice(1)))].flatMap((id) => document.getElementById(id) ?? []);
    const naMetadeDeCima = (s: Element) => {
      const r = s.getBoundingClientRect();
      return r.top < innerHeight / 2 && r.bottom > 80;
    };
    const marcar = () => {
      // Em tela alta o rodapé de contato nunca sobe até a metade de cima; o fim da página o marca.
      const fim = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      const atual = fim ? secoes.at(-1) : secoes.findLast(naMetadeDeCima);
      for (const a of links) {
        if (a.hash.slice(1) === atual?.id) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      }
    };
    marcar();
    addEventListener("scroll", marcar, { passive: true });
    return () => removeEventListener("scroll", marcar);
  }, []);
  return null;
}
