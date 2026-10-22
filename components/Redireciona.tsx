// Export estático não tem redirect de servidor: o <meta refresh> leva o navegador e o link cobre quem o bloqueia.
export function Redireciona({ destino, rotulo }: { destino: string; rotulo: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destino}`} />
      <main className="l-wrap l-topo">
        <a className="l-btn" href={destino}>
          {rotulo}
        </a>
      </main>
    </>
  );
}
