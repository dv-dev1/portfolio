import { expect, test, type Page } from "@playwright/test";

// Clique antes da hidratação cai no vazio: todo teste que interage espera a lanterna montar.
async function abrir(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator("html[data-hidratado]")).toBeAttached();
}

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
