import type { Metadata } from "next";
import { Redireciona } from "@/components/Redireciona";
import { getLocale, getSite } from "@/content/i18n";

// O endereço antigo continua respondendo, mas sem indexar: a lista agora é uma seção do Início.
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: site.projetos.titulo, robots: { index: false } };
}

export default async function Projetos() {
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  return <Redireciona destino={`/${locale}/#projetos`} rotulo={site.ui.projetos} />;
}
