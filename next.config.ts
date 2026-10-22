import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// O SHA vai para a estação "commit"; antes do primeiro commit não há HEAD, então vira "local".
function commitCurto(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "local";
  }
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: { globalNotFound: true },
  env: { COMMIT: commitCurto() },
};

export default nextConfig;
