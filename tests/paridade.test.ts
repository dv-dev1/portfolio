import assert from "node:assert/strict";
import { test } from "node:test";
import { site as en } from "../content/en.ts";
import { site as pt, type Site } from "../content/pt.ts";

const ligacoes = (s: Site) => s.projetos.lista.map(({ slug, area, repo, site }) => ({ slug, area, repo, site }));

test("pt e en listam os mesmos projetos, na mesma ordem", () => {
  assert.deepEqual(ligacoes(en), ligacoes(pt));
});

test("destaques e caso apontam para projetos da lista", () => {
  for (const s of [pt, en]) {
    const slugs = new Set(s.projetos.lista.map((p) => p.slug));
    for (const d of s.inicio.destaques) assert.ok(slugs.has(d.slug), `destaque sem projeto: ${d.slug}`);
    assert.ok(slugs.has(s.caso.slug), `caso sem projeto: ${s.caso.slug}`);
  }
});
