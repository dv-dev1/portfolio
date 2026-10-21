"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { perfis } from "@/content/locales";

type Fase = "copiar" | "copiado" | "falhou";

const nada = () => () => {};
const endereco = () => `${perfis.email.user}@${perfis.email.domain}`;

// R14: o servidor nunca junta as metades; o endereço só existe depois da hidratação.
function useNoNavegador() {
  return useSyncExternalStore(nada, () => true, () => false);
}

export function EmailLink({ antes }: { antes: string }) {
  const email = useNoNavegador() ? endereco() : null;
  return (
    <a className="l-cv" href={email ? `mailto:${email}` : "#contato"}>
      {email ?? antes}
    </a>
  );
}

export function CopiarEmail({ rotulos }: { rotulos: Record<Fase, string> }) {
  const [fase, setFase] = useState<Fase>("copiar");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copiar() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(endereco());
      setFase("copiado");
      timer.current = setTimeout(() => setFase("copiar"), 1800);
    } catch {
      // Sem área de transferência (http, permissão negada) não há o que confirmar.
      setFase("falhou");
    }
  }

  return (
    <button type="button" className="l-copy l-mono" onClick={copiar} aria-live="polite">
      {rotulos[fase]}
    </button>
  );
}
