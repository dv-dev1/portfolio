"use client";

import { useSyncExternalStore } from "react";

const formato = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Fortaleza",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

let agora = 0;

function assinar(avisar: () => void) {
  agora = Date.now();
  const id = setInterval(() => {
    agora = Date.now();
    avisar();
  }, 1000);
  return () => clearInterval(id);
}

// No servidor não há hora certa para o visitante: o HTML estático leva --:--:-- e o navegador preenche.
export function Relogio() {
  const t = useSyncExternalStore(assinar, () => agora, () => 0);
  return <span>{t ? formato.format(t) : "--:--:--"}</span>;
}
