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

// Gráficos por setor: os 10 maiores setores (pela planilha completa) e o restante somado em "Outros"
const TOP_SECTORS = 10;
export const OTHERS = 'Outros';
export const sectorGroups: [string, string[]][] = [
  ...sectorOrder.slice(0, TOP_SECTORS).map((s): [string, string[]] => [s, [s]]),
  [OTHERS, sectorOrder.slice(TOP_SECTORS)],
];

// Licenças comerciais do Kaspersky: valor fictício e fixo por licença (R$), uma por notebook.
// Todas valem 3 anos e vencem juntas
export const AV_PRICE = 300;
export const AV_YEARS = 3;

// Custos (valores fictícios): compra de cada notebook e assinatura anual do Microsoft 365 por conta
export const NB_PRICE = 4500;
export const LIC_PRICE = { Standard: 900, Basic: 420 } as const;

// Partes das barras empilhadas de gasto por setor: aba Licenças (por tipo de licença) e aba Dispositivos (por tipo de gasto)
export const LIC_PARTS = [
  ['Standard', 'Standard'],
  ['Basic', 'Basic'],
] as const;
export const DEV_PARTS = [
  ['nb', 'Notebooks'],
  ['av', 'Antivírus'],
] as const;

// Pendências de uma linha (as mesmas das listas do dashboard; PC divergente e selo repetido dependem de outras linhas)
const pendSeg = (r: Rec) => r.pc && (!r.laps || !r.av || r.win === 'Home');
const pendCad = (r: Rec) => (r.pc && !r.selo) || !r.emailOk || !r.nomeOk || r.s === NO_SECTOR;

// Filtros da aba Dashboard: chave, título, opções [valor, texto] e o teste de cada linha
type Filter = { key: string; label: string; options: [string, string][]; test: (r: Rec, v: string) => boolean };
export const FILTERS: Filter[] = [
  { key: 'win', label: 'Versão do Windows', options: [['Pro', 'Windows 11 Pro'], ['Home', 'Windows 11 Home']], test: (r, v) => r.win === v },
  { key: 'lic', label: 'Licença principal', options: [['Standard', 'Standard'], ['Basic', 'Basic']], test: (r, v) => r.l === v },
  { key: 'laps', label: 'Status LAPS', options: [['ok', 'Aplicado'], ['no', 'Pendente']], test: (r, v) => r.pc && r.laps === (v === 'ok') },
  { key: 'av', label: 'Status antivírus', options: [['ok', 'Ativo'], ['no', 'Inativo']], test: (r, v) => r.pc && r.av === (v === 'ok') },
  { key: 'pc', label: 'Equipamento', options: [['ok', 'Com notebook corp.'], ['no', 'Sem notebook corp.']], test: (r, v) => r.pc === (v === 'ok') },
  { key: 'selo', label: 'Selo patrimônio', options: [['ok', 'Com selo'], ['no', 'Sem selo']], test: (r, v) => r.pc && r.selo === (v === 'ok') },
  { key: 'setor', label: 'Setor', options: SECTORS.map((s) => [s, s]), test: (r, v) => r.s === v },
  {
    key: 'pend',
    label: 'Pendência',
    options: [['seg', 'De segurança'], ['cad', 'De cadastro'], ['none', 'Sem pendência']],
    test: (r, v) => (v === 'seg' ? pendSeg(r) : v === 'cad' ? pendCad(r) : !pendSeg(r) && !pendCad(r)),
  },
];

// Mantém só as linhas que passam em todos os filtros escolhidos ('' = Todos)
export function applyFilters(rows: Rec[], sel: Record<string, string>) {
  const active = FILTERS.filter((f) => sel[f.key]);
  return rows.filter((r) => active.every((f) => f.test(r, sel[f.key])));
}

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

  // Status de cada KPI com meta: good (meta batida), warn (atenção) ou crit (crítico).
  // LAPS e antivírus: meta de 100%; abaixo de 85% é crítico. w guarda o % para o anel de progresso.
  const metaSt = (v: number) => (v >= 100 ? 'good' : v >= 85 ? 'warn' : 'crit');
  w.laps = pct(lapsOk, eq.length);
  w.av = pct(avOk, eq.length);
  t['laps:st'] = eq.length ? metaSt(w.laps) : 'good';
  t['av:st'] = eq.length ? metaSt(w.av) : 'good';
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
    // Gravidade do setor pela pior pendência: sem antivírus > sem LAPS > Windows Home
    t[`pend:${i}:st`] = !p ? '' : p.av ? 'crit' : p.laps ? 'serious' : 'warn';
    w[`pend:${i}`] = p ? pct(p.n, top[0].n) : 0;
    // Partes da barra empilhada: quanto de cada tipo de pendência
    for (const k of ['laps', 'av', 'home'] as const) w[`pend:${i}:${k}`] = p ? pct(p[k], p.n) : 0;
  }

  const brl = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

  // Aba Licenças: gasto com Microsoft 365 em 12 meses, no total e por tipo de licença
  const licCost = (rs: Rec[]) => ({
    Standard: rs.filter((r) => r.l === 'Standard').length * LIC_PRICE.Standard,
    Basic: rs.filter((r) => r.l === 'Basic').length * LIC_PRICE.Basic,
  });
  const lc = licCost(rows);
  t['m365'] = brl(lc.Standard + lc.Basic);
  t['m365:sub'] = `${plural(rows.length, 'licença', 'licenças')} · 12 meses`;
  for (const [k] of LIC_PARTS) t[`lic:${k}:cost`] = `${brl(lc[k])}/ano`;
  t['pc:total'] = String(PEND_CAD.reduce((a, [k]) => a + Number(t[`pc:${k}`]), 0));
  t['pc:total:st'] = t['pc:total'] === '0' ? 'good' : 'warn';
  // Semáforo de cada pendência de cadastro
  for (const [k] of PEND_CAD) t[`pc:${k}:st`] = t[`pc:${k}`] === '0' ? 'good' : 'warn';

  // Aba Dispositivos: compra dos notebooks e licenças de antivírus (3 anos)
  const dc = { nb: eq.length * NB_PRICE, av: avOk * AV_PRICE };
  t['dev'] = brl(dc.nb + dc.av);
  t['dev:sub'] = `notebooks e antivírus de ${plural(eq.length, 'equipamento', 'equipamentos')}`;
  t['dev:nb:sub'] = `${plural(eq.length, 'notebook', 'notebooks')} × ${brl(NB_PRICE)}`;
  t['dev:av:sub'] = `${plural(avOk, 'licença', 'licenças')} × ${brl(AV_PRICE)} · ${AV_YEARS} anos`;
  const maxDev = Math.max(dc.nb, dc.av, 1);
  for (const [k] of DEV_PARTS) {
    t[`dev:${k}`] = brl(dc[k]);
    t[`dev:${k}:pct`] = pct1(dc[k], dc.nb + dc.av);
    w[`dev:${k}`] = pct(dc[k], maxDev);
  }

  // Por setor: contas, dispositivos e os dois gastos
  // Notebooks com alguma pendência de segurança (sem LAPS, sem antivírus ou Windows Home)
  const seg = eq.filter(pendSeg).length;
  t.seg = String(seg);
  t['seg:sub'] = `de ${plural(eq.length, 'notebook', 'notebooks')}`;
  // Até 10% dos notebooks com pendência é atenção; acima disso, crítico
  t['seg:st'] = !seg ? 'good' : seg <= eq.length * 0.1 ? 'warn' : 'crit';

  const bySector = sectorGroups.map(([s, group]) => {
    const sr = rows.filter((r) => group.includes(r.s));
    const se = sr.filter((r) => r.pc);
    const av = se.filter((r) => r.av).length;
    return { s, sr, c: sr.length, d: se.length, av, lic: licCost(sr), dev: { nb: se.length * NB_PRICE, av: av * AV_PRICE } };
  });
  const sum = (o: Record<string, number>) => Object.values(o).reduce((a, v) => a + v, 0);
  // Escala das barras só pelos 10 maiores setores: "Outros" soma vários setores e aparece como texto, sem barra
  const bigs = bySector.filter((x) => x.s !== OTHERS);
  const maxC = Math.max(...bigs.map((x) => x.c), 1);
  const maxLic = Math.max(...bigs.map((x) => sum(x.lic)), 1);
  const maxDevS = Math.max(...bigs.map((x) => sum(x.dev)), 1);
  for (const { s, sr, c, d, av, lic, dev } of bySector) {
    // "Outros" mostra quantos setores estão somados nele
    const name = s === OTHERS ? `${OTHERS} (${sectorGroups.at(-1)![1].length} setores)` : s;
    t[`set:${s}:c`] = String(c);
    t[`set:${s}:d`] = String(d);
    t[`set:${s}:tip`] = `${name}: ${c} contas · ${d} notebooks` + (c > d ? ` · faltam ${c - d}` : '');
    w[`set:${s}:c`] = pct(c, maxC);
    w[`set:${s}:d`] = pct(d, c); // notebooks dentro da barra de contas

    // Barras empilhadas: total relativo ao setor que mais gasta, dividido pelas partes
    const std = sr.filter((r) => r.l === 'Standard').length;
    t[`lcs:${s}`] = brl(sum(lic));
    t[`lcs:${s}:tip`] = `${name}: ${plural(c, 'licença', 'licenças')} (${std} Standard · ${c - std} Basic) = ${brl(sum(lic))}/ano`;
    w[`lcs:${s}`] = pct(sum(lic), maxLic);
    for (const [k] of LIC_PARTS) w[`lcs:${s}:${k}`] = pct(lic[k], sum(lic));
    t[`dvs:${s}`] = brl(sum(dev));
    t[`dvs:${s}:tip`] = `${name}: ${brl(sum(dev))} · ${plural(d, 'notebook', 'notebooks')} ${brl(dev.nb)} · ${plural(av, 'antivírus', 'antivírus')} ${brl(dev.av)}`;
    w[`dvs:${s}`] = pct(sum(dev), maxDevS);
    for (const [k] of DEV_PARTS) w[`dvs:${s}:${k}`] = pct(dev[k], sum(dev));
  }

  return { t, w };
}

