export const siteUrl = "https://daniel-vieira.green-grid.workers.dev";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };

// O e-mail fica em duas metades: só o navegador as junta (components/Email.tsx).
export const perfis = {
  linkedin: "https://www.linkedin.com/in/dv-dev",
  github: "https://github.com/dv-dev1",
  email: { user: "danielvmacedog1", domain: "gmail.com" },
};
