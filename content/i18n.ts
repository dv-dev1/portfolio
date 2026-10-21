import { lang } from "next/root-params";
import type { Locale } from "./locales";

// O layout só gera pt e en (dynamicParams = false), então o valor já é um Locale.
export async function getLocale(): Promise<Locale> {
  return (await lang()) as Locale;
}
