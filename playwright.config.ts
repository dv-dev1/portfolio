import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: "e2e.spec.ts",
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4173" },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:4173/",
    timeout: 10_000,
    stderr: "ignore",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, grepInvert: /@celular/ },
    // iPhone 13 no Chromium: o que se testa é (hover: none) e a largura, e o Chromium emula os dois.
    { name: "celular", use: { ...devices["iPhone 13"], browserName: "chromium" }, grep: /@celular/ },
  ],
});
