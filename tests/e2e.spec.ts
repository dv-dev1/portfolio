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

test("com cursor, o título começa apagado", async ({ page }) => {
  await abrir(page, "/pt/");
  await expect(page.locator("h1")).toHaveCSS("color", "rgb(94, 94, 94)");
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
  await abrir(page, "/pt/projects/");
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
  await abrir(page, "/pt/projects/");
  const linha = page.locator(".l-list > li", { hasText: "Agendamento de exames" });
  await expect(linha).toContainText("trabalho");
  await expect(linha.locator("a")).toHaveCount(0);
});

test("idioma em projetos leva a /en/projects/", async ({ page }) => {
  await abrir(page, "/pt/projects/");
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/projects\/$/);
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
  await abrir(page, "/pt/about/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sobre");
  await expect(page.locator(".l-traj > li")).toHaveCount(5);
  await expect(page.locator("img")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("PDF");
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.locator(".l-convite")).not.toContainText(/whatsapp/i);
});

test("404 procura com a luz", async ({ page }) => {
  await abrir(page, "/404.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nada aqui.", { useInnerText: true });
  await expect(page.locator(".l-light")).toHaveClass(/l-busca/);
  await expect(page).toHaveTitle("Nada aqui · Daniel Vieira");
  await expect(page.locator(".l-eyebrow")).toContainText("404 · GET /404.html");
});

test("sobre em pt aponta a versão em inglês", async ({ page }) => {
  await page.goto("/pt/about/");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    "https://daniel-vieira.green-grid.workers.dev/en/about/",
  );
});
