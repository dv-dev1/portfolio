"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = { rotulo: string; fechar: string; marca: string; children: ReactNode };

export function MenuCelular({ rotulo, fechar, marca, children }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);

  // Os links vêm prontos do servidor; fechar em qualquer <a> cobre o "Contato", que só troca o hash.
  function fecharAoSeguirLink(e: MouseEvent) {
    if ((e.target as Element).closest("a")) dialogo.current?.close();
  }

  return (
    <>
      <button type="button" className="l-menu-btn l-mono" aria-haspopup="dialog" onClick={() => dialogo.current?.showModal()}>
        {rotulo}
      </button>
      <dialog ref={dialogo} className="l-sheet" aria-label={rotulo} onClick={fecharAoSeguirLink}>
        <div className="l-nav">
          <span className="l-mono l-marca">{marca}</span>
          <button type="button" className="l-menu-btn l-mono" onClick={() => dialogo.current?.close()}>
            {fechar}
          </button>
        </div>
        {children}
      </dialog>
    </>
  );
}
