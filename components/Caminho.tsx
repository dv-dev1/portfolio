"use client";

import { useSyncExternalStore } from "react";

const nada = () => () => {};

// A 404 é um arquivo só para qualquer endereço: o caminho pedido só existe no navegador.
export function Caminho() {
  return useSyncExternalStore(nada, () => location.pathname, () => "");
}
