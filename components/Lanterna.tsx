"use client";

import { useEffect, useRef } from "react";

export function Lanterna({ animacao }: { animacao: "l-sweep" | "l-busca" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const luz = ref.current;
    if (!luz) return;
    let quadro = 0;
    let x = 0;
    let y = 0;
    const pintar = () => {
      quadro = 0;
      // Animação CSS vence estilo inline: a varredura inicial sai de cena no primeiro movimento.
      luz.classList.remove(animacao);
      luz.style.setProperty("--lx", `${x}px`);
      luz.style.setProperty("--ly", `${y}px`);
    };
    const mover = (e: PointerEvent) => {
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
      if (!quadro) quadro = requestAnimationFrame(pintar);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.dataset.hidratado = "";
    return () => {
      window.removeEventListener("pointermove", mover);
      cancelAnimationFrame(quadro);
    };
  }, [animacao]);

  return <div ref={ref} className={`l-light ${animacao}`} aria-hidden="true" />;
}
