// Dados fictícios da planilha de controle de notebooks e cálculo do dashboard.
// O mesmo cálculo roda no servidor (estado inicial, sem JS) e no navegador (animação).

// Contas ativas por setor na planilha completa (soma = 100). "Sem setor" = conta com o setor em branco
const SECTOR_SIZES: [string, number][] = [
  ['Comercial', 13],
  ['Produção', 12],
  ['Garantia da Qualidade', 10],
  ['Engenharia e Manutenção', 9],
  ['Produção/CQ', 7],
  ['TI', 6],
  ['Financeiro', 5],
  ['Logística', 5],
  ['Marketing', 4],
  ['Sócio', 3],
  ['Biotério', 3],
  ['Compras', 3],
  ['RH', 3],
  ['Assuntos Regulatórios', 3],
  ['PCP', 3],
  ['Segurança da Informação', 2],
  ['Facilities', 2],
  ['Portaria', 2],
  ['Recepção', 1],
  ['Proprietário', 1],
  ['Sem setor', 3],
];
export const NO_SECTOR = 'Sem setor';

// Por que a conta não tem notebook corporativo
export const MOTIVOS = [
  ['particular', 'Computador particular'],
  ['naoTem', 'Não tem notebook próprio'],
  ['none', 'Sem motivo informado'],
] as const;
type Motivo = (typeof MOTIVOS)[number][0];
export const SECTORS = SECTOR_SIZES.map(([s]) => s);

export type Example = {
  nome: string;
  setor: string;
  lic: 'Standard' | 'Basic';
  pc: string; // '' = conta sem notebook corporativo
  av?: 'Ativo' | 'Inativo';
  laps?: 'Aplicado' | 'Pendente';
  pat?: string; // '' = sem selo de patrimônio
  win?: 'Pro' | 'Home';
  motivo?: Motivo; // só para conta sem notebook
};

// Linhas que aparecem na tabela
export const initial: Example[] = [
  { nome: 'Ana Souza', setor: 'Financeiro', lic: 'Standard', pc: 'NTB-001', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0101', win: 'Pro' },
  { nome: 'Bruno Lima', setor: 'Comercial', lic: 'Basic', pc: 'NTB-002', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0102', win: 'Pro' },
  { nome: 'Carla Mendes', setor: 'Marketing', lic: 'Standard', pc: 'NTB-003', av: 'Ativo', laps: 'Pendente', pat: 'PAT-0103', win: 'Home' },
  { nome: 'Diego Rocha', setor: 'Garantia da Qualidade', lic: 'Basic', pc: 'NTB-004', av: 'Inativo', laps: 'Aplicado', pat: 'PAT-0104', win: 'Pro' },
  { nome: 'Elisa Prado', setor: 'RH', lic: 'Standard', pc: 'NTB-005', av: 'Ativo', laps: 'Aplicado', pat: '', win: 'Home' },
  { nome: 'Fábio Martins', setor: 'Logística', lic: 'Basic', pc: '', motivo: 'particular' },
  { nome: 'Gabriela Teixeira', setor: 'Assuntos Regulatórios', lic: 'Standard', pc: 'NTB-006', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0106', win: 'Pro' },
  { nome: 'Igor Ramos', setor: 'Produção', lic: 'Basic', pc: 'NTB-007', av: 'Inativo', laps: 'Pendente', pat: 'PAT-0107', win: 'Home' },
  { nome: 'Juliana Freitas', setor: 'Compras', lic: 'Standard', pc: 'NTB-008', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0108', win: 'Pro' },
  { nome: 'Lucas Barbosa', setor: 'TI', lic: 'Standard', pc: 'NTB-009', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0109', win: 'Pro' },
  { nome: 'Mariana Duarte', setor: 'Engenharia e Manutenção', lic: 'Basic', pc: 'NTB-010', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0110', win: 'Home' },
  { nome: 'Otávio Pires', setor: 'Produção', lic: 'Basic', pc: '', motivo: 'naoTem' },
];

// Colaboradores que "chegam" do Microsoft 365 durante a animação (completam os 15 exemplos e as 100 linhas)
export const incoming: Example[] = [
  { nome: 'Patrícia Gomes', setor: 'Produção/CQ', lic: 'Standard', pc: 'NTB-011', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0111', win: 'Pro' },
  { nome: 'Rafael Moreira', setor: 'Comercial', lic: 'Basic', pc: 'NTB-012', av: 'Ativo', laps: 'Pendente', pat: '', win: 'Pro' },
  { nome: 'Sofia Cardoso', setor: 'Biotério', lic: 'Standard', pc: 'NTB-013', av: 'Inativo', laps: 'Aplicado', pat: 'PAT-0113', win: 'Home' },
];

// Linha resumida usada no cálculo. n = índice em `incoming` (-1 = já está na planilha)
export type Rec = {
  s: string;
  l: 'Standard' | 'Basic';
  pc: boolean;
  av: boolean;
  laps: boolean;
  selo: boolean;
  win: 'Pro' | 'Home' | null;
  motivo: Motivo | null;
  emailOk: boolean; // e-mail no domínio da empresa
  nomeOk: boolean; // nome de usuário preenchido
  pcId?: string; // só nas linhas de exemplo, para conferir PC e selo repetidos
  pat?: string;
  n: number;
};

const toRec = (e: Example, n: number): Rec => ({
  s: e.setor,
  l: e.lic,
  pc: !!e.pc,
  av: e.av === 'Ativo',
  laps: e.laps === 'Aplicado',
  selo: !!e.pat,
  win: e.pc ? (e.win ?? 'Pro') : null,
  motivo: e.pc ? null : (e.motivo ?? 'none'),
  emailOk: true,
  nomeOk: true,
  pcId: e.pc || undefined,
  pat: e.pat || undefined,
  n,
});

// Completa as 100 linhas com contas fictícias (gerador fixo: o resultado é sempre o mesmo)
function buildRecords(): Rec[] {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const recs = [...initial.map((e) => toRec(e, -1)), ...incoming.map((e, i) => toRec(e, i))];
  for (const [s, size] of SECTOR_SIZES) {
    const used = recs.filter((r) => r.s === s).length;
    for (let i = used; i < size; i++) {
      // Sócios costumam ter menos notebook corporativo
      const pc = rand() < (s === 'Sócio' ? 0.4 : 0.8);
      const m = rand();
      recs.push({
        s,
        l: rand() < 0.75 ? 'Standard' : 'Basic',
        pc,
        av: pc && rand() < 0.97,
        laps: pc && rand() < 0.8,
        selo: pc && rand() < 0.96,
        win: pc ? (rand() < 0.82 ? 'Pro' : 'Home') : null,
        motivo: pc ? null : m < 0.47 ? 'particular' : m < 0.93 ? 'naoTem' : 'none',
        emailOk: rand() > 0.03,
        nomeOk: rand() > 0.02,
        n: -1,
      });
    }
  }
  return recs;
}
export const records = buildRecords();

// Ordem fixa dos setores nos gráficos (pela planilha completa), para as linhas não pularem durante a animação
export const sectorOrder = [...SECTORS].sort(
  (a, b) => records.filter((r) => r.s === b).length - records.filter((r) => r.s === a).length || SECTORS.indexOf(a) - SECTORS.indexOf(b),
);

export const PEND_TOP = 6;

// Valor fictício e fixo de cada licença de antivírus (R$). Uma licença por notebook, válida por 3 anos
export const AV_PRICE = 300;
export const AV_YEARS = 3;

// Listas de pendências do dashboard (chave usada no cálculo, texto da linha)
export const PEND_SEG = [
  ['laps', 'Equipamentos sem LAPS'],
  ['av', 'Equipamentos sem antivírus'],
  ['home', 'Equipamentos com Windows Home'],
] as const;
export const PEND_CAD = [
  ['selo', 'Equipamentos sem selo de patrimônio'],
  ['email', 'E-mails com usuário fora do domínio'],
  ['nome', 'Registros sem nome de usuário'],
  ['setor', 'Contas sem setor preenchido'],
  ['div', 'PCs com dados divergentes entre linhas'],
  ['dup', 'Selo usado em PCs diferentes'],
] as const;

// Rosquinha: círculo de perímetro 100, então p% vira direto o tamanho do traço.
// seg 0 = primeira categoria (a partir do topo), seg 1 = o restante; g abre uma pequena folga entre os dois.
export function donutDash(p: number, seg: number) {
  const g = p > 0 && p < 100 ? 1 : 0;
  return seg === 0
    ? { dash: `${Math.max(p - g, 0)} ${100 - p + g}`, offset: '0' }
    : { dash: `${Math.max(100 - p - g, 0)} ${p + g}`, offset: String(-p) };
}

// Textos (t) e larguras em % (w) de cada elemento do dashboard
export function compute(rows: Rec[]) {
  const t: Record<string, string> = {};
  const w: Record<string, number> = {};
  const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
  const pct1 = (a: number, b: number) => `${pct(a, b).toFixed(1).replace('.', ',')}%`;
  // Barras de uma lista: largura relativa ao maior valor da própria lista
  const bars = (prefix: string, vals: [string, number][]) => {
    const max = Math.max(...vals.map(([, v]) => v), 1);
    for (const [k, v] of vals) {
      t[`${prefix}:${k}`] = String(v);
      w[`${prefix}:${k}`] = pct(v, max);
    }
  };

  // KPIs
  const eq = rows.filter((r) => r.pc);
  const semPc = rows.filter((r) => !r.pc);
  const lapsOk = eq.filter((r) => r.laps).length;
  const avOk = eq.filter((r) => r.av).length;
  const semSelo = eq.filter((r) => !r.selo).length;
  t.contas = String(rows.length);
  t.equip = String(eq.length);
  t.laps = pct1(lapsOk, eq.length);
  t['laps:sub'] = `${lapsOk} de ${eq.length} notebooks`;
  t.av = pct1(avOk, eq.length);
  t['av:sub'] = `${avOk} de ${eq.length} notebooks`;
  t.semPc = String(semPc.length);
  t['semPc:sub'] = `de ${rows.length} contas ativas`;
  t.semSelo = String(semSelo);
  t['semSelo:sub'] = `de ${eq.length} notebooks`;

  // Contas ativas por licença
  bars('lic', [
    ['Standard', rows.filter((r) => r.l === 'Standard').length],
    ['Basic', rows.filter((r) => r.l === 'Basic').length],
  ]);

  // Versão do Windows (rosquinha: % do Pro)
  const pro = eq.filter((r) => r.win === 'Pro').length;
  const home = eq.length - pro;
  t['win:Pro'] = String(pro);
  t['win:Home'] = String(home);
  w['win:Pro'] = pct(pro, eq.length);
  t['win:Pro:pct'] = `${Math.round(pct(pro, eq.length))}%`;
  t['win:Home:pct'] = `${Math.round(pct(home, eq.length))}%`;

  // Tabela de segurança dos notebooks: com, sem e % com
  for (const [k, ok] of [
    ['laps', lapsOk],
    ['av', avOk],
  ] as const) {
    t[`seg:${k}:com`] = String(ok);
    t[`seg:${k}:sem`] = String(eq.length - ok);
    t[`seg:${k}:pct`] = pct1(ok, eq.length);
  }

  // Contas sem notebook corporativo, por motivo
  for (const [k] of MOTIVOS) {
    const n = semPc.filter((r) => r.motivo === k).length;
    t[`mot:${k}`] = String(n);
    t[`mot:${k}:pct`] = pct1(n, semPc.length);
  }

  // Pendências de segurança e de cadastro
  bars('ps', [
    ['laps', eq.length - lapsOk],
    ['av', eq.length - avOk],
    ['home', home],
  ]);
  // PC repetido em linhas com dados que não batem, e selo usado em mais de um PC
  const byPc = new Map<string, Set<string>>();
  const byPat = new Map<string, Set<string>>();
  for (const r of eq) {
    if (r.pcId) byPc.set(r.pcId, (byPc.get(r.pcId) ?? new Set()).add(`${r.win}|${r.av}|${r.laps}|${r.pat}`));
    if (r.pat && r.pcId) byPat.set(r.pat, (byPat.get(r.pat) ?? new Set()).add(r.pcId));
  }
  bars('pc', [
    ['selo', semSelo],
    ['email', rows.filter((r) => !r.emailOk).length],
    ['nome', rows.filter((r) => !r.nomeOk).length],
    ['setor', rows.filter((r) => r.s === NO_SECTOR).length],
    ['div', [...byPc.values()].filter((v) => v.size > 1).length],
    ['dup', [...byPat.values()].filter((v) => v.size > 1).length],
  ]);

  // Setores com mais pendências de segurança: sem LAPS, sem antivírus ou Windows Home
  const pend = new Map<string, { av: number; laps: number; home: number }>();
  for (const r of eq) {
    const p = pend.get(r.s) ?? { av: 0, laps: 0, home: 0 };
    p.av += +!r.av;
    p.laps += +!r.laps;
    p.home += +(r.win === 'Home');
    pend.set(r.s, p);
  }
  const top = [...pend]
    .map(([s, p]) => ({ s, ...p, n: p.av + p.laps + p.home }))
    .filter((p) => p.n > 0)
    .sort((a, b) => b.n - a.n || SECTORS.indexOf(a.s) - SECTORS.indexOf(b.s))
    .slice(0, PEND_TOP);
  for (let i = 0; i < PEND_TOP; i++) {
    const p = top[i];
    t[`pend:${i}:name`] = p?.s ?? '';
    t[`pend:${i}`] = p ? String(p.n) : '';
    t[`pend:${i}:tip`] = p ? `LAPS ${p.laps} · Antivírus ${p.av} · Windows Home ${p.home}` : '';
    // Detalhe por tipo, visível no ranking do celular (lá não existe "passar o mouse")
    t[`pend:${i}:laps`] = String(p?.laps ?? 0);
    t[`pend:${i}:av`] = String(p?.av ?? 0);
    t[`pend:${i}:home`] = String(p?.home ?? 0);
    w[`pend:${i}`] = p ? pct(p.n, top[0].n) : 0;
  }

  // Por setor: contas, dispositivos e notebooks com antivírus
  const bySector = SECTORS.map((s) => {
    const sr = rows.filter((r) => r.s === s);
    const se = sr.filter((r) => r.pc);
    return { s, c: sr.length, d: se.length, av: se.filter((r) => r.av).length };
  });
  const maxC = Math.max(...bySector.map((x) => x.c), 1);
  const maxAv = Math.max(...bySector.map((x) => x.av), 1);
  const brl = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
  t['avc:total'] = brl(avOk * AV_PRICE);
  for (const { s, c, d, av } of bySector) {
    t[`set:${s}:c`] = String(c);
    t[`set:${s}:d`] = String(d);
    t[`set:${s}:tip`] = `${s}: ${c} contas · ${d} dispositivos` + (c > d ? ` · faltam ${c - d}` : '');
    t[`set:${s}:gap`] = c > d ? '1' : ''; // setor com conta sem notebook: coluna de contas destacada
    w[`set:${s}:c`] = pct(c, maxC);
    w[`set:${s}:d`] = pct(d, c); // celular: notebooks dentro da barra de contas
    w[`set:${s}:dh`] = pct(d, maxC); // computador: coluna de notebooks ao lado, mesma escala das contas
    // Gasto com licenças de antivírus por setor (uma licença por notebook com antivírus ativo)
    t[`avc:${s}`] = brl(av * AV_PRICE);
    t[`avc:${s}:tip`] = `${s}: ${av} ${av === 1 ? 'licença' : 'licenças'} × ${brl(AV_PRICE)} = ${brl(av * AV_PRICE)} (válidas por ${AV_YEARS} anos)`;
    w[`avc:${s}`] = pct(av, maxAv);
  }

  return { t, w };
}

