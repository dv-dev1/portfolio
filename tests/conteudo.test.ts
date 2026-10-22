import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const RAIZ = join(import.meta.dirname, "..");
const OUT = join(RAIZ, "out");
const EMAIL = ["danielvmacedog1", "gmail.com"].join("@");

const proibidos: [string, RegExp][] = [
  ["acurácia", /acurácia/i],
  ["accuracy", /accuracy/i],
  ["AWS API Gateway", /AWS API Gateway/i],
  ["ECS", /\bECS\b/],
  ["CAIXA", /\bCAIXA\b/],
  ["wa.me", /wa\.me/i],
];

// O repositório é público: o que está sob NDA entra por hash, ou a guarda publicaria o que esconde.
const sigilosos = new Map([
  ["c2c627adb2826892a872eb24e0216aff4635b0d54e5ecfcfe45d69ab9df49abf", "nome do cliente sob NDA"],
  ["0832df22bfb060d436d3dc99dd4bf3d18212e1264dc3a32a8c4a65950cb139f5", "sigla do cliente sob NDA"],
  ["7a308f799cae603e9d6c76b26589c69320596f8a1ebc0dad393a2a8a6981c5f1", "trecho do telefone"],
  ["142927fd66eaa414d87776a31a2a48c8f458954026aff51abdd8b16e2aab004a", "nome do banco cliente"],
]);

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function candidatos(texto: string, numeros: string): Set<string> {
  const palavras = texto.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const saida = new Set(palavras);
  for (let i = 0; i + 1 < palavras.length; i++) saida.add(`${palavras[i]} ${palavras[i + 1]}`);
  for (const [seq] of numeros.matchAll(/\d{5,}/g)) for (let i = 0; i + 5 <= seq.length; i++) saida.add(seq.slice(i, i + 5));
  return saida;
}

function sigilososEm(texto: string, numeros: string, mapa = sigilosos): string[] {
  const achados: string[] = [];
  for (const c of candidatos(texto, numeros)) {
    const rotulo = mapa.get(sha256(c));
    if (rotulo) achados.push(rotulo);
  }
  return achados;
}

// Nome de chunk em hex dentro de <script> e do .txt tem 5 dígitos seguidos e daria falso positivo.
const semScripts = (arquivo: string, texto: string) =>
  arquivo.endsWith(".html") ? texto.replace(/<script[\s\S]*?<\/script>/gi, " ") : "";

const paginas = () => readdirSync(OUT, { recursive: true, encoding: "utf8" }).filter((f) => /\.(html|txt)$/.test(f));

test("out/ tem páginas", () => {
  assert.ok(existsSync(OUT), "rode npm run build antes");
  assert.ok(paginas().length > 0);
});

// O robô edita content/*.ts: um termo num comentário ou num campo que não renderiza iria ao PR público. Sem <script> no fonte, a janela de dígitos usa o texto inteiro.
const fontes = ["content/pt.ts", "content/en.ts"];

test("nenhuma página publica termo proibido nem sigiloso", () => {
  const problemas: string[] = [];
  const alvos = [
    ...paginas().map((f): [string, string, string] => {
      const texto = readFileSync(join(OUT, f), "utf8");
      return [f, texto, semScripts(f, texto)];
    }),
    ...fontes.map((f): [string, string, string] => {
      const texto = readFileSync(join(RAIZ, f), "utf8");
      return [f, texto, texto];
    }),
  ];
  for (const [arquivo, texto, numeros] of alvos) {
    for (const [nome, padrao] of proibidos) if (padrao.test(texto)) problemas.push(`${arquivo}: ${nome}`);
    if (texto.toLowerCase().includes(EMAIL)) problemas.push(`${arquivo}: e-mail inteiro`);
    for (const rotulo of sigilososEm(texto, numeros)) problemas.push(`${arquivo}: ${rotulo}`);
  }
  assert.deepEqual(problemas, []);
});

// Mapa sintético: o teste da guarda não pode depender dos termos reais, que só existem como hash.
test("a guarda acha o par de palavras e a janela de 5 dígitos", () => {
  const mapa = new Map([
    [sha256("acme saúde"), "par"],
    [sha256("91234"), "fone"],
  ]);
  assert.deepEqual(sigilososEm("Clínica ACME Saúde", "fone 8191234567", mapa), ["par", "fone"]);
  assert.deepEqual(sigilososEm("acme e saúde", "9123", mapa), []);
});
