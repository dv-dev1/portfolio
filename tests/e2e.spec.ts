import { expect, test } from "@playwright/test";

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
