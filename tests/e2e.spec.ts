import { expect, test, type Page } from "@playwright/test";

// Clique antes da hidratação cai no vazio: todo teste que interage espera a lanterna montar.
async function abrir(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator("html[data-hidratado]")).toBeAttached();
}

const EMAIL = ["danielvmacedog1", "gmail.com"].join("@");

test.describe("raiz em inglês", () => {
  test.use({ locale: "en-US" });
  test("raiz com en-US vai para /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test.describe("raiz em português", () => {
  test.use({ locale: "pt-BR" });
  test("raiz com pt-BR vai para /pt/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt\/$/);
  });
});

test.describe("raiz sem JavaScript", () => {
  test.use({ javaScriptEnabled: false, locale: "pt-BR" });
  test("sem JavaScript, a raiz cai em /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test("html lang segue o idioma da rota", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/pt/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});

test("título da aba segue o idioma", async ({ page }) => {
  await page.goto("/en/");
  await expect(page).toHaveTitle("Daniel Vieira · applied AI engineer");
  await page.goto("/pt/");
  await expect(page).toHaveTitle("Daniel Vieira · engenheiro de IA aplicada");
});

test("lanterna segue o ponteiro", async ({ page }) => {
  await abrir(page, "/pt/");
  await page.mouse.move(300, 400);
  const luz = page.locator(".l-light");
  await expect
    .poll(() => luz.evaluate((e: HTMLElement) => [e.style.getPropertyValue("--lx"), e.style.getPropertyValue("--ly")]))
    .toEqual(["300px", "400px"]);
  await expect(luz).not.toHaveClass(/l-sweep/);
});

test("idioma no início leva ao início do outro idioma", async ({ page }) => {
  await abrir(page, "/pt/");
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
});

test.describe("celular", () => {
  test("@celular sem lanterna e com menu em dialog", async ({ page }) => {
    await abrir(page, "/pt/");
    await expect(page.locator(".l-light")).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    for (const nome of ["Início", "Projetos", "Sobre"]) await expect(menu.getByRole("link", { name: nome })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("@celular contato fecha o menu", async ({ page }) => {
    await abrir(page, "/pt/");
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await menu.getByRole("link", { name: "Contato" }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#contato$/);
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("títulos acesos, feixe parado e lanterna fora", async ({ page }) => {
    await abrir(page, "/pt/");
    await expect(page.locator("h1")).toHaveCSS("color", "rgb(230, 225, 217)");
    await expect(page.locator(".l-beam")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".l-light")).toBeHidden();
  });
});

test("com cursor, o nome já começa aceso", async ({ page }) => {
  await abrir(page, "/pt/");
  await expect(page.locator("h1")).toHaveCSS("color", "rgb(230, 225, 217)");
});

test.describe("trace da borda", () => {
  const caixa = (page: Page) => page.locator("[data-trace]");

  test("sem /cdn-cgi/trace, a caixa mostra exemplo", async ({ page }) => {
    await abrir(page, "/pt/");
    await expect(caixa(page)).toHaveAttribute("data-trace", "exemplo");
    await expect(caixa(page)).toContainText("GET /cdn-cgi/trace · exemplo");
    await expect(page.locator(".l-trace")).toContainText("colo=GRU");
  });

  test("com a borda simulada, mostra GIG ao vivo e nunca o IP", async ({ page }) => {
    await page.route("**/cdn-cgi/trace", (rota) =>
      rota.fulfill({
        status: 200,
        contentType: "text/plain",
        body: "fl=29f114\nh=localhost\nip=203.0.113.9\nts=1761000000.000\nvisit_scheme=https\ncolo=GIG\nhttp=http/2\nloc=PT\ntls=TLSv1.3\n",
      }),
    );
    await abrir(page, "/pt/");
    await expect(caixa(page)).toHaveAttribute("data-trace", "vivo");
    await expect(caixa(page)).toContainText("ao vivo");
    await expect(page.locator(".l-trace")).toContainText("colo=GIG");
    await expect(page.locator("#caminho")).toContainText("GIG · PoP mais perto de você");
    await expect(page.locator("body")).not.toContainText("203.0.113.9");
    await expect(page.locator(".l-trace")).not.toContainText("ip=");
  });

  test("trace 200 que não é trace continua exemplo", async ({ page }) => {
    await page.route("**/cdn-cgi/trace", (rota) =>
      rota.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html>\n<title>oi</title>\ncolo=<b>nada</b>\n" }),
    );
    await abrir(page, "/pt/");
    await expect(caixa(page)).toHaveAttribute("data-trace", "exemplo");
  });
});

test("e-mail só existe depois do carregamento", async ({ page }) => {
  const html = await (await page.request.get("/pt/")).text();
  expect(html).not.toContain(EMAIL);
  await abrir(page, "/pt/");
  await expect(page.getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`);
});

test.describe("copiar e-mail", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });
  test("copiar e-mail vira copiado e põe o endereço na área de transferência", async ({ page }) => {
    await abrir(page, "/pt/");
    await page.getByRole("button", { name: "copiar e-mail" }).click();
    await expect(page.getByRole("button", { name: "copiado ✓" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });
});

test("copiar sem área de transferência avisa", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("negado")) } });
  });
  await abrir(page, "/pt/");
  await page.getByRole("button", { name: "copiar e-mail" }).click();
  await expect(page.getByRole("button", { name: "copie manualmente" })).toBeVisible();
});

test("filtro por área deixa só a área e Todos volta à lista", async ({ page }) => {
  await abrir(page, "/pt/#projetos");
  const linhas = page.locator(".l-list > li");
  const total = await linhas.count();
  const filtros = page.getByRole("group", { name: "Filtrar por área" });
  await filtros.getByRole("button", { name: /^Agentes e IA/ }).click();
  await expect(filtros.getByRole("button", { name: /^Agentes e IA/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.l-list > li:not([data-area="ia"])')).toHaveCount(0);
  const ia = await linhas.count();
  expect(ia).toBeGreaterThan(0);
  expect(ia).toBeLessThan(total);
  await filtros.getByRole("button", { name: /^Todos/ }).click();
  await expect(linhas).toHaveCount(total);
});

test("trabalho de empresa aparece sem link e com o selo trabalho", async ({ page }) => {
  await abrir(page, "/pt/#projetos");
  const linha = page.locator(".l-list > li", { hasText: "Agendamento de exames" });
  await expect(linha).toContainText("trabalho");
  await expect(linha.locator("a")).toHaveCount(0);
});

test("idioma numa seção leva ao início do outro idioma", async ({ page }) => {
  await abrir(page, "/pt/#projetos");
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
});

test("idioma no caso mantém o caso", async ({ page }) => {
  await abrir(page, "/pt/projects/agentgraph/");
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/projects\/agentgraph\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("agentgraph");
});

test("demo do agentgraph pausa e retoma", async ({ page }) => {
  await abrir(page, "/pt/projects/agentgraph/");
  const log = page.getByRole("log", { name: "Saída do terminal" });
  await expect(log).toContainText("PAUSED");
  await page.getByRole("button", { name: "resume f3a1 approved" }).click();
  await expect(log).toContainText("credit of R$ 40.000,00 released");
  await expect(log.locator(".l-say").last()).toHaveText("OK");
  await expect(page.getByRole("button", { name: "rodar de novo" })).toBeVisible();
  await log.locator(".l-tl").first().evaluate((el) => el.setAttribute("data-velho", ""));
  await page.getByRole("button", { name: "rodar de novo" }).click();
  await expect(log).not.toContainText("released");
  // Nó novo no DOM é o que reinicia a animação; o mesmo nó só mudaria de texto.
  await expect(log.locator(".l-tl").first()).not.toHaveAttribute("data-velho");
});

test("cards do início levam ao caso ou ao site", async ({ page }) => {
  await abrir(page, "/pt/");
  await expect(page.locator(".l-card", { hasText: "quehorasvoto" })).toHaveAttribute("href", "https://quehorasvoto.green-grid.workers.dev");
  await page.locator(".l-card", { hasText: "agentgraph" }).click();
  await expect(page).toHaveURL(/\/pt\/projects\/agentgraph\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("agentgraph");
});

test("sobre sem foto, sem currículo e sem WhatsApp de contato", async ({ page }) => {
  await abrir(page, "/pt/#sobre");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 2, name: "Sobre" })).toBeVisible();
  await expect(page.locator(".l-traj > li")).toHaveCount(5);
  await expect(page.locator("#sobre img")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("PDF");
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.locator(".l-convite")).toHaveCount(0);
  await abrir(page, "/en/#sobre");
  await expect(page.locator("#sobre img")).toHaveCount(0);
});

const link = (page: Page, nome: string) => page.locator(".l-nav-links").getByRole("link", { name: nome, exact: true });
// Espera a rolagem suave parar e devolve a distância entre o fim do menu e o começo da seção: 0 é o título logo abaixo, negativo é ele escondido.
async function folgaDoMenu(page: Page, seletor: string) {
  let anterior = NaN;
  await expect
    .poll(
      async () => {
        const y = await page.evaluate(() => scrollY);
        const parado = y === anterior;
        anterior = y;
        return parado;
      },
      { intervals: [250] },
    )
    .toBe(true);
  return page.evaluate(
    (sel) => document.querySelector(sel)!.getBoundingClientRect().top - document.querySelector("header.l-nav")!.getBoundingClientRect().bottom,
    seletor,
  );
}

for (const lang of ["pt", "en"]) {
  test(`certificados levam à verificação em ${lang}`, async ({ page }) => {
    await abrir(page, `/${lang}/#sobre`);
    await expect(page.getByRole("link", { name: /Claude Code in Action/ })).toHaveAttribute(
      "href",
      "https://verify.skilljar.com/c/9wfpxanju3og",
    );
    await expect(page.getByRole("link", { name: /Introduction to Generative AI/ })).toHaveAttribute(
      "href",
      "https://www.credly.com/badges/edc3bd9d-953d-49b9-9904-c69ad5dc3546/linked_in_profile",
    );
  });
}

test("clicar em Projetos rola na mesma página até a seção", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await abrir(page, "/pt/");
  await page.evaluate(() => Object.assign(window, { marca: 1 }));
  await link(page, "Projetos").click();
  await expect(page).toHaveURL(/\/pt\/#projetos$/);
  expect(await page.evaluate(() => "marca" in window)).toBe(true);
  const folga = await folgaDoMenu(page, "#projetos");
  expect(folga).toBeGreaterThanOrEqual(-1);
  expect(folga).toBeLessThan(40);
});

test("o menu marca a seção visível", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await abrir(page, "/pt/");
  await expect(link(page, "Início")).toHaveAttribute("aria-current", "location");
  await link(page, "Sobre").click();
  await expect(link(page, "Sobre")).toHaveAttribute("aria-current", "location");
  await expect(link(page, "Início")).not.toHaveAttribute("aria-current");
});

test("em tela alta, o fim da página marca Contato", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await abrir(page, "/pt/");
  await link(page, "Contato").click();
  await expect(link(page, "Contato")).toHaveAttribute("aria-current", "location");
  await expect(link(page, "Sobre")).not.toHaveAttribute("aria-current");
});

test("depois de rolar, o menu continua no topo da tela", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await abrir(page, "/pt/");
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(2000);
  const caixa = await page.locator("header.l-nav").boundingBox();
  expect(Math.abs(caixa!.y)).toBeLessThanOrEqual(1);
  await expect(link(page, "Sobre")).toBeInViewport();
});

test("rolagem suave por padrão", async ({ page }) => {
  await abrir(page, "/pt/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
});

test.describe("rolagem com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });
  test("a rolagem não anima", async ({ page }) => {
    await abrir(page, "/pt/");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  });
});

test("@celular tocar em Sobre fecha o menu e leva à seção", async ({ page }) => {
  await abrir(page, "/pt/");
  await page.getByRole("button", { name: "Menu" }).tap();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("link", { name: "Sobre" }).tap();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/pt\/#sobre$/);
  const folga = await folgaDoMenu(page, "#sobre");
  expect(folga).toBeGreaterThanOrEqual(-1);
  expect(folga).toBeLessThan(40);
});

for (const [de, para] of [
  ["/pt/projects/", "/pt/#projetos"],
  ["/en/about/", "/en/#sobre"],
]) {
  test(`${de} leva à seção do início`, async ({ page, request }) => {
    await page.goto(de);
    await expect(page).toHaveURL(new RegExp(`${para}$`));
    const html = await (await request.get(de)).text();
    expect(html).toContain(`http-equiv="refresh" content="0;url=${para}"`);
    expect(html).toMatch(/<meta name="robots" content="noindex/);
    expect(html).toContain(`href="${para}"`);
  });
}

test("404 procura com a luz", async ({ page }) => {
  await abrir(page, "/404.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nada aqui.", { useInnerText: true });
  await expect(page.locator(".l-light")).toHaveClass(/l-busca/);
  await expect(page).toHaveTitle("Nada aqui · Daniel Vieira");
  await expect(page.locator(".l-eyebrow")).toContainText("404 · GET /404.html");
});

test("início em pt aponta a versão em inglês", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    "https://daniel-vieira.green-grid.workers.dev/en/",
  );
});

test("no computador a página sai em 80% e a luz fica fora da escala", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await abrir(page, "/en/");
  const zoom = (seletor: string) => page.locator(seletor).first().evaluate((e) => e.currentCSSZoom);
  expect(await zoom("main")).toBeCloseTo(0.8);
  expect(await zoom("header")).toBeCloseTo(0.8);
  expect(await zoom(".l-light")).toBe(1);
});

test("no celular a escala não muda @celular", async ({ page }) => {
  await abrir(page, "/pt/");
  expect(await page.locator("main").evaluate((e) => e.currentCSSZoom)).toBe(1);
});

for (const url of ["/en/", "/404.html"]) {
  test(`favicon DV em ${url}`, async ({ page, request }) => {
    await page.goto(url);
    const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
    expect(href).toMatch(/\.svg/);
    const resposta = await request.get(href!);
    expect(resposta.status()).toBe(200);
    expect(await resposta.text()).toContain("DV");
  });
}

test("no computador os títulos cabem na escala nova", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await abrir(page, "/pt/");
  const efetivo = (seletor: string) =>
    page.locator(seletor).first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize) * e.currentCSSZoom);
  expect(await efetivo(".p-inicio .l-h1")).toBeLessThanOrEqual(96);
  expect(await efetivo(".l-h2")).toBeLessThanOrEqual(40);
  expect(await efetivo(".l-contato-t")).toBeLessThanOrEqual(56);
});
