import type { Metadata } from "next";
import { Caminho } from "@/components/Caminho";
import { Casca } from "@/components/Casca";
import { Linhas } from "@/components/Texto";
import { site } from "@/content/pt";
import { fontMono, fontSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: site.naoEncontrada.aba };

// Endereço que não casa com rota não tem idioma: a 404 é uma só, em português, sem next/root-params.
export default function NaoEncontrada() {
  const t = site.naoEncontrada;
  return (
    <html lang="pt-BR" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body>
        <Casca locale="pt" site={site} pagina="404" rota="" animacao="l-busca">
          <main className="l-wrap p-404">
            <p className="l-mono l-dim l-eyebrow">
              {t.eyebrow} <Caminho />
            </p>
            <h1 className="l-hide l-h1">
              <Linhas texto={t.titulo} />
            </h1>
            <div className="l-hero-pe">
              <p className="l-lead">{t.texto}</p>
              <div className="l-acoes">
                <a className="l-btn" href="/pt/">
                  {t.inicio}
                </a>
                <a className="l-btn" href="/pt/projects/">
                  {t.projetos}
                </a>
              </div>
            </div>
          </main>
        </Casca>
      </body>
    </html>
  );
}
