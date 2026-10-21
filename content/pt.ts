export type Area = "ia" | "auto" | "web" | "tool";
export type Trecho = string | { hi: string };
export type Paragrafo = Trecho[];
export type Rotulado = { k: string; v: string };

export type Project = {
  slug: string;
  nome: string;
  area: Area;
  selo: string;
  ano: string;
  desc: string;
  stack: string[];
  repo?: string;
  site?: string;
};

export type Destaque = { slug: string; selo: string; desc: string; stack: string[] };
export type LinhaTerminal = { t: string; c: "l-cmd" | "l-out" | "l-say" | "l-cmt" };
export type Emprego = { quando: string; org: string; papel: string; itens: string[] };

export type TextosDemo = {
  nos: string[];
  ok: string;
  pausado: string;
  esperando: string;
  run: LinhaTerminal[];
  resume: LinhaTerminal[];
  aprovar: string;
  notaAprovar: string;
  deNovo: string;
  notaDeNovo: string;
  rotuloLog: string;
};

export type TextosCaminho = {
  titulo: string;
  texto: string;
  estacoes: Rotulado[];
  traceTexto: string;
  exemplo: string;
  aoVivo: string;
};

export type Site = {
  meta: { titulo: string; descricao: string };
  ui: {
    navegacao: string;
    idioma: string;
    inicio: string;
    projetos: string;
    sobre: string;
    contato: string;
    menu: string;
    fechar: string;
    coordenadas: string;
    copyright: string;
    contatoLink: string;
    lerCaso: string;
    verProjeto: string;
  };
  inicio: {
    eyebrow: string;
    titulo: string;
    lead: Paragrafo;
    verProjetos: string;
    seguirFeixe: string;
    agora: Rotulado[];
    cidade: string;
    fuso: string;
    medido: string;
    numeros: { n: string; texto: string; nota: string }[];
    selecionados: string;
    todos: string;
    destaques: Destaque[];
    caminho: TextosCaminho;
    contato: { titulo: string; emailAntes: string; copiar: string; copiado: string; falhou: string; stack: string; topo: string };
  };
  projetos: {
    titulo: string;
    eyebrow: string;
    lead: Paragrafo;
    filtroRotulo: string;
    filtros: { id: Area | "todos"; rotulo: string }[];
    lista: Project[];
    github: string;
  };
  caso: {
    slug: string;
    titulo: string;
    trilha: string;
    trilhaRotulo: string;
    lead: Paragrafo;
    meta: Rotulado[];
    codigo: string;
    fatos: Rotulado[];
    problema: { titulo: string; paragrafos: Paragrafo[]; citacao: string };
    rodar: { titulo: string; texto: Paragrafo; demo: TextosDemo };
    funciona: { titulo: string; intro: string; arquivos: Rotulado[]; no: Paragrafo; codNo: string[]; humano: Paragrafo; codHumano: string[] };
    armadilha: { titulo: string; aviso: string; codRuim: string[]; texto: Paragrafo };
    naoE: { titulo: string; linhas: Rotulado[] };
    outros: string;
    voltar: string;
    todos: string;
    proximo: string;
  };
  sobre: {
    eyebrow: string;
    titulo: string;
    paragrafos: Paragrafo[];
    linkedin: string;
    trajetoria: string;
    empregos: Emprego[];
    ferramentas: string;
    stack: { nome: string; itens: string[] }[];
    colunasRotulo: string;
    colunas: { titulo: string; itens: Rotulado[] }[];
    convite: string;
    conviteNota: string;
    voltar: string;
  };
  naoEncontrada: { aba: string; eyebrow: string; titulo: string; texto: string; inicio: string; projetos: string };
};

const gh = (nome: string) => `https://github.com/dv-dev1/${nome}`;

// As linhas de terminal e de código são saída real do agentgraph, iguais nos dois idiomas.
const run: LinhaTerminal[] = [
  { t: "$ python -m demo.cli run --application A-1042", c: "l-cmd" },
  { t: "[fetch_application] proposal A-1042, R$ 40.000,00 over 24 months", c: "l-out" },
  { t: "[score]             score 742, declared income R$ 8.500,00", c: "l-out" },
  { t: "[assess]            income not verified yet", c: "l-out" },
  { t: "[fetch_income]      verified income R$ 8.000,00", c: "l-out" },
  { t: "[assess]            debt ratio 21 percent, within policy", c: "l-out" },
  { t: "[check_threshold]   40000.00 above the 5000.00 limit", c: "l-out" },
  { t: "PAUSED  thread=f3a1  waiting: approve credit of R$ 40.000,00 for customer 88231?", c: "l-say" },
];

export const site: Site = {
  meta: {
    titulo: "Daniel Vieira · engenheiro de IA aplicada",
    descricao: "Agentes, pipelines RAG e automações que rodam em produção. Projetos, estudo de caso e contato de Daniel Vieira, em João Pessoa.",
  },
  ui: {
    navegacao: "Principal",
    idioma: "Idioma",
    inicio: "Início",
    projetos: "Projetos",
    sobre: "Sobre",
    contato: "Contato",
    menu: "Menu",
    fechar: "Fechar",
    coordenadas: "7°07′S 34°52′W",
    copyright: "© 2026 Daniel Vieira · João Pessoa, PB",
    contatoLink: "contato →",
    lerCaso: "ler o estudo de caso →",
    verProjeto: "ver projeto →",
  },
  inicio: {
    eyebrow: "engenheiro de IA aplicada · full stack · joão pessoa",
    titulo: "Daniel\nVieira",
    lead: [{ hi: "Construo agentes, pipelines RAG e automações que rodam em produção." }, " Sistemas de IA viáveis de operar em escala, não protótipos caros."],
    verProjetos: "Ver projetos",
    seguirFeixe: "Seguir o feixe ↓",
    agora: [
      { k: "agora", v: "Smartspace · IA e dados" },
      { k: "e", v: "Etros Logística · automação e IA" },
    ],
    cidade: "joão pessoa",
    fuso: "UTC−3",
    medido: "medido em produção",
    numeros: [
      {
        n: "−99,3%",
        texto: "no custo por consulta de um agente sobre 2.000+ produtos: o catálogo inteiro no prompt deu lugar a RAG com Pinecone.",
        nota: "US$ 6,00 → US$ 0,04 · de 3 para 500 clientes/dia",
      },
      {
        n: "~230",
        texto: "marcações de exame concluídas, contra ~120 antes, nos primeiros meses após a migração: o agendamento de um hospital de grande porte saiu do n8n e foi para código.",
        nota: "harness com policies, hooks e guardrails",
      },
      {
        n: "−80%",
        texto: "no ciclo de engenharia de bots: o protótipo no Figma vira JSON, e o JSON vira bot de produção no Botpress.",
        nota: "design-to-bot · apresentado no TechUpdate",
      },
    ],
    selecionados: "Projetos\nselecionados",
    todos: "todos os projetos →",
    destaques: [
      {
        slug: "agentgraph",
        selo: "código aberto",
        desc: "Motor de grafo de agentes que para, espera aprovação humana e retoma do ponto exato, mesmo depois que o processo morreu. Zero dependências.",
        stack: ["Python", "SQLite", "Pytest", "GitHub Actions"],
      },
      {
        slug: "geniai-agente",
        selo: "no ar",
        desc: "Assistente de pré-vendas no WhatsApp: entende texto e áudio, faz a triagem e passa o lead ao especialista. Um painel mostra o funil e o custo de IA por conversa.",
        stack: ["LangGraph", "Next.js", "Postgres", "Z-API"],
      },
      {
        slug: "quehorasvoto",
        selo: "no ar · 27 UFs",
        desc: "Quantas pessoas votaram em cada meia hora na sua seção eleitoral, contado direto dos logs de urna publicados pelo TSE.",
        stack: ["Python", "Cloudflare Workers"],
      },
      {
        slug: "emporio-da-musica-agent",
        selo: "case técnico",
        desc: "Agente de atendimento que sabe se a pergunta é sobre os dados da loja ou sobre a política interna: tool calling sobre SQLite e BM25 no manual.",
        stack: ["Python", "SQLite", "BM25", "tool calling"],
      },
    ],
    caminho: {
      titulo: "Como esta página\nchega até você",
      texto: "Um feixe por requisição. Cada estação acende quando ele passa; as três últimas mostram dados desta visita, lidos da borda da Cloudflare.",
      estacoes: [
        { k: "commit", v: "{commit} · main" },
        { k: "ci", v: "GitHub Actions · build estático" },
        { k: "deploy", v: "Cloudflare Workers" },
        { k: "borda", v: "{colo} · PoP mais perto de você" },
        { k: "protocolo", v: "{http} · {tls}" },
        { k: "você", v: "{loc} · agora" },
      ],
      traceTexto: "Isto é o que a Cloudflare sabe sobre esta visita. O IP nunca aparece na tela e nada disso é guardado.",
      exemplo: "exemplo",
      aoVivo: "ao vivo",
    },
    contato: {
      titulo: "Acenda\numa conversa.",
      emailAntes: "e-mail",
      copiar: "copiar e-mail",
      copiado: "copiado ✓",
      falhou: "copie manualmente",
      stack: "Next.js estático · servido pela Cloudflare",
      topo: "voltar ao topo ↑",
    },
  },
  projetos: {
    titulo: "Projetos",
    eyebrow: "{n} projetos · trabalho e código aberto",
    lead: [{ hi: "O que já rodou com gente de verdade do outro lado." }, " Trabalhos de cliente aparecem sem código e sem nome quando há NDA; o resto está no GitHub."],
    filtroRotulo: "Filtrar por área",
    filtros: [
      { id: "todos", rotulo: "Todos" },
      { id: "ia", rotulo: "Agentes e IA" },
      { id: "auto", rotulo: "Automação" },
      { id: "web", rotulo: "Produto e web" },
      { id: "tool", rotulo: "Ferramentas" },
    ],
    lista: [
      {
        slug: "agentgraph",
        nome: "agentgraph",
        area: "ia",
        selo: "código aberto",
        ano: "2026",
        desc: "Motor de grafo de agentes com checkpoint em SQLite e aprovação humana. Para, morre e retoma do ponto exato.",
        stack: ["Python", "SQLite", "Pytest"],
        repo: gh("agentgraph"),
      },
      {
        slug: "agendamento-de-exames",
        nome: "Agendamento de exames",
        area: "ia",
        selo: "trabalho · NDA",
        ano: "2026",
        desc: "Hospital de grande porte: do n8n para agente em código com harness. De ~120 para ~230 marcações concluídas nos primeiros meses após a migração.",
        stack: ["agente em código", "guardrails", "modelos locais"],
      },
      {
        slug: "design-to-bot",
        nome: "design-to-bot",
        area: "auto",
        selo: "trabalho · Smartspace",
        ano: "2026",
        desc: "Plugin de Figma gera JSON; o App Builder transforma o JSON em bot de produção no Botpress. −80% no ciclo de engenharia.",
        stack: ["Figma", "JSON", "Botpress"],
      },
      {
        slug: "geniai-agente",
        nome: "geniai-agente",
        area: "ia",
        selo: "no ar",
        ano: "2026",
        desc: "Pré-vendas no WhatsApp com texto e áudio, triagem e passagem ao especialista. Painel com funil e custo de IA por conversa.",
        stack: ["LangGraph", "Next.js", "Z-API"],
        repo: gh("geniai-agente"),
        site: "https://geniai-web.vercel.app",
      },
      {
        slug: "emporio-da-musica-agent",
        nome: "emporio-da-musica-agent",
        area: "ia",
        selo: "case técnico",
        ano: "2026",
        desc: "Agente de atendimento que separa dado operacional de política interna: tool calling sobre SQLite e BM25 no manual.",
        stack: ["Python", "SQLite", "BM25"],
        repo: gh("emporio-da-musica-agent"),
      },
      {
        slug: "n8n-rag-catalog-optimizer",
        nome: "n8n-rag-catalog-optimizer",
        area: "auto",
        selo: "estudo de caso",
        ano: "2025",
        desc: "Catálogo de 2.000+ produtos fora do prompt e dentro do Pinecone: de US$ 6,00 para US$ 0,04 por consulta.",
        stack: ["n8n", "Pinecone", "RAG"],
        repo: gh("n8n-rag-catalog-optimizer"),
      },
      {
        slug: "quehorasvoto",
        nome: "quehorasvoto",
        area: "web",
        selo: "no ar",
        ano: "2026",
        desc: "Votos por meia hora em cada seção eleitoral, contados dos logs de urna do TSE, para escolher o horário mais vazio.",
        stack: ["Python", "Cloudflare Workers"],
        repo: gh("quehorasvoto"),
        site: "https://quehorasvoto.green-grid.workers.dev",
      },
      {
        slug: "formula-de-impacto",
        nome: "formula-de-impacto",
        area: "web",
        selo: "código aberto",
        ano: "2026",
        desc: "Formulário de entrevista de campo que monta só as perguntas de quem está na frente. Funciona sem sinal de celular.",
        stack: ["JavaScript", "offline", "97 testes"],
        repo: gh("formula-de-impacto"),
      },
      {
        slug: "achei-no-campus",
        nome: "achei-no-campus",
        area: "web",
        selo: "acadêmico",
        ano: "2026",
        desc: "Achados e perdidos da UNIPÊ: app mobile para registrar e encontrar objetos no campus.",
        stack: ["Flutter", "Firebase"],
        repo: gh("achei-no-campus"),
      },
      {
        slug: "vox",
        nome: "vox",
        area: "tool",
        selo: "fork",
        ano: "2026",
        desc: "Ditado local por push-to-talk no Linux, adaptado para Fedora com Wayland e sem GPU. Nada sai da máquina.",
        stack: ["Go", "Whisper"],
        repo: gh("vox"),
      },
    ],
    github: "todos os repositórios no GitHub ↗",
  },
  caso: {
    slug: "agentgraph",
    titulo: "agentgraph",
    trilha: "projetos",
    trilhaRotulo: "Trilha",
    lead: [{ hi: "Um motor de grafo de agentes que para, espera um humano decidir e volta de onde parou" }, " — mesmo que o processo tenha morrido no meio."],
    meta: [
      { k: "papel", v: "autor" },
      { k: "ano", v: "2026" },
      { k: "stack", v: "Python 3.9+ · SQLite · Pytest · GitHub Actions" },
    ],
    codigo: "código",
    fatos: [
      { k: "279", v: "linhas no motor, contando docstrings" },
      { k: "0", v: "dependências: só a biblioteca padrão" },
      { k: "4", v: "arquivos para ler numa sentada" },
      { k: "1", v: "linha no SQLite por passo executado" },
    ],
    problema: {
      titulo: "O problema",
      paragrafos: [
        ["Um agente que só responde perguntas é inofensivo. Um agente que ", { hi: "age" }, " — libera dinheiro, apaga arquivo, manda e-mail — faz coisas que não se desfazem, e ninguém põe isso em produção sem um humano aprovar antes."],
        ["Só que esperar uma pessoa significa segurar um processo aberto por horas ou dias. Ninguém faz isso. Então o estado sai da memória e vai para o disco, e o agente precisa conseguir morrer e voltar."],
      ],
      citacao: "Entre o run e o resume nada está vivo. Nenhum daemon, nenhuma thread esperando. O único elo é um arquivo SQLite.",
    },
    rodar: {
      titulo: "Veja rodar",
      texto: ["Um pedido de crédito. O grafo busca a proposta, pontua, avalia e para quando o valor passa do limite. Repare que ", { hi: "assess" }, " roda duas vezes: o grafo tem um ciclo."],
      demo: {
        nos: ["fetch_application", "score", "assess", "fetch_income", "assess", "check_threshold", "human_approval", "disburse"],
        ok: "ok",
        pausado: "pausado",
        esperando: "esperando",
        run,
        resume: [
          { t: "# o processo morreu. feche o terminal, reinicie, volte amanhã.", c: "l-cmt" },
          { t: "$ python -m demo.cli resume f3a1 approved", c: "l-cmd" },
          { t: "[human_approval]    answer: approved", c: "l-out" },
          { t: "[disburse]          credit of R$ 40.000,00 released", c: "l-out" },
          { t: "OK", c: "l-say" },
        ],
        aprovar: "resume f3a1 approved",
        notaAprovar: "o processo já saiu. a aprovação acorda o grafo.",
        deNovo: "rodar de novo",
        notaDeNovo: "aprovar duas vezes dá erro: o resume recusa thread que não está pausada.",
        rotuloLog: "Saída do terminal",
      },
    },
    funciona: {
      titulo: "Como funciona",
      intro: "Quatro arquivos, 279 linhas.",
      arquivos: [
        { k: "state.py", v: "os reducers e o merge do que cada nó devolve no estado" },
        { k: "checkpoint.py", v: "SQLite, uma linha por passo" },
        { k: "graph.py", v: "montagem, validação, loop de execução e resume" },
        { k: "interrupt.py", v: "interrupt() e a exceção por trás dele" },
      ],
      no: [{ hi: "Um nó é uma função comum." }, " Nunca toca o banco e nunca sabe que foi pausado. Devolve só o que mudou."],
      codNo: [
        "def assess(state: dict) -> dict:",
        '    if "verified_income" not in state["customer"]:',
        '        return {"facts": ["income not verified"]}',
        '    return {"amount": state["application"]["value"],',
        '            "facts": ["within policy"]}',
      ],
      humano: [{ hi: "Pedir a um humano é uma chamada." }, " Na primeira passada o interrupt lança; o motor grava estado e pergunta no SQLite e sai. No resume, a mesma chamada devolve a resposta."],
      codHumano: [
        "def human_approval(state: dict) -> dict:",
        "    answer = interrupt(f\"approve credit of {state['amount']}?\")",
        '    return {"approved": answer == "approved"}',
      ],
    },
    armadilha: {
      titulo: "A armadilha",
      aviso: "Retomar não continua da linha depois do interrupt. Roda o nó de novo desde a primeira linha: tudo acima da chamada acontece duas vezes.",
      codRuim: ["def bad(state):", "    send_email(state)  # enviado duas vezes", '    answer = interrupt("proceed?")', "    ..."],
      texto: [
        "A semântica é at-least-once por nó, e o LangGraph não é diferente. A correção não está no motor, está em onde ficam os efeitos colaterais: ",
        { hi: "abaixo do interrupt, ou num nó próprio." },
        " Um teste fixa esse comportamento para ninguém \"consertar\" sem querer.",
      ],
    },
    naoE: {
      titulo: "O que não é",
      linhas: [
        { k: "concorrência", v: "sem async, sem nós em paralelo, sem subgrafos, sem retries" },
        { k: "lock", v: "um processo por thread; dois resume ao mesmo tempo não são defendidos" },
        { k: "auth", v: "a tela de aprovação roda em localhost, sem login: é demonstração" },
        { k: "LangGraph", v: "não substitui; é a parte dele que explica o resto, escrita à mão" },
      ],
    },
    outros: "Outros projetos",
    voltar: "← voltar",
    todos: "Todos os projetos",
    proximo: "próximo →",
  },
  sobre: {
    eyebrow: "joão pessoa, pb · 7°07′S 34°52′W",
    titulo: "Sobre",
    paragrafos: [
      [{ hi: "Sou engenheiro de IA aplicada e desenvolvedor full stack." }, " Construo agentes de IA, pipelines RAG e automações que rodam em produção, com foco em sistemas viáveis de operar em escala, não protótipos caros."],
      ["Hoje trabalho na Smartspace com IA conversacional, agentes corporativos e dados, e na Etros Logística com automação e IA para operações de comércio exterior."],
    ],
    linkedin: "LinkedIn ↗",
    trajetoria: "Trajetória",
    empregos: [
      {
        quando: "set/2026 — hoje",
        org: "Etros Logística",
        papel: "automação e IA · PJ · remoto",
        itens: [
          "Fluxos internos em n8n para automatizar os processos da empresa.",
          "Agentes de IA em Python com LangChain e LangGraph.",
          "OCR e LLMs para extrair dados de Invoice e Packing List.",
          "Integrações com e-mail, ERP e SQL Server, com trilha de auditoria nos workflows.",
        ],
      },
      {
        quando: "nov/2025 — hoje",
        org: "Smartspace",
        papel: "engenheiro de IA e dados · joão pessoa",
        itens: [
          "Agendamento de exames de um hospital de grande porte, do n8n para agente em código com harness: de ~120 para ~230 marcações concluídas nos primeiros meses após a migração.",
          "Design-to-bot: o Figma vira JSON e o JSON vira bot no Botpress. −80% no ciclo de engenharia; apresentado no TechUpdate.",
          "Agentes de IA para o Banco do Nordeste e agentes corporativos no Copilot Studio com Power Automate e Microsoft Graph.",
          "Testes em Pytest para agentes e integrações; CI/CD com GitHub Actions.",
        ],
      },
      {
        quando: "jul — nov/2025",
        org: "Inteligentte Lab",
        papel: "estágio em IA aplicada · joão pessoa",
        itens: [
          "RAG com Pinecone sobre um catálogo de 2.000+ produtos: de US$ 6,00 para US$ 0,04 por consulta (−99,3%). Com o mesmo orçamento, de 3 para 500 clientes por dia.",
          "APIs REST em FastAPI para agentes; Supabase com Row Level Security.",
        ],
      },
      {
        quando: "jul — nov/2025",
        org: "Agência Quinze",
        papel: "estágio em automação e agentes · joão pessoa",
        itens: ["Fluxos em Make e n8n para eliminar tarefas repetitivas.", "Integração entre CRM, ferramentas de marketing e ClickUp via APIs e webhooks."],
      },
      {
        quando: "dez/2024 — hoje",
        org: "Projetos independentes",
        papel: "ETL, IA aplicada e full stack · remoto",
        itens: ["APIs em NestJS para clientes; deploy em AWS, VPS e Cloudflare Workers.", "Integração com WhatsApp Business API e Graph API via OAuth 2."],
      },
    ],
    ferramentas: "Ferramentas",
    stack: [
      { nome: "ia e agentes", itens: ["LangChain", "LangGraph", "RAG", "Pinecone", "pgvector", "OCR", "MCP servers", "Copilot Studio", "Botpress", "n8n"] },
      { nome: "back-end", itens: ["Python", "FastAPI", "TypeScript", "Node.js", "NestJS", "SQL Server", "Postgres · Supabase"] },
      { nome: "front-end", itens: ["React", "Next.js", "Tailwind CSS", "React Native"] },
      { nome: "infra", itens: ["Docker", "GitHub Actions", "AWS Lambda", "Terraform", "Cloudflare Workers", "Vercel"] },
    ],
    colunasRotulo: "Formação, certificações e idiomas",
    colunas: [
      {
        titulo: "formação",
        itens: [
          { k: "Unipê", v: "CST em Análise e Desenvolvimento de Sistemas · 2025–2026" },
          { k: "UNIESP", v: "Processamento de Dados · 2023" },
        ],
      },
      {
        titulo: "certificações",
        itens: [
          { k: "Claude Code in Action", v: "Anthropic" },
          { k: "Introduction to Generative AI", v: "AWS Educate · ago/2025" },
        ],
      },
      {
        titulo: "idiomas",
        itens: [
          { k: "Português", v: "nativo" },
          { k: "Inglês", v: "escrita técnica C1 · conversação B1–B2" },
        ],
      },
    ],
    convite: "Acenda uma conversa",
    conviteNota: "e-mail · linkedin →",
    voltar: "voltar à trajetória ↑",
  },
  naoEncontrada: {
    aba: "Nada aqui · Daniel Vieira",
    eyebrow: "404 · GET",
    titulo: "Nada\naqui.",
    texto: "A luz procurou e não achou esta página. O endereço pode ter mudado.",
    inicio: "Voltar ao início",
    projetos: "Ver projetos",
  },
};
