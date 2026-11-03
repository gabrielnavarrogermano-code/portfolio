// Dados fictícios da planilha de controle de notebooks e cálculo do dashboard.
// O mesmo cálculo roda no servidor (estado inicial, sem JS) e no navegador (animação).

export const SHEET_TOTAL = 100;

// Contas ativas por setor na planilha completa (soma = 100)
const SECTOR_SIZES: [string, number][] = [
  ['Comercial', 15],
  ['Produção', 13],
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
];
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
};

// Linhas que aparecem na tabela
export const initial: Example[] = [
  { nome: 'Ana Souza', setor: 'Financeiro', lic: 'Standard', pc: 'NTB-001', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0101', win: 'Pro' },
  { nome: 'Bruno Lima', setor: 'Comercial', lic: 'Basic', pc: 'NTB-002', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0102', win: 'Pro' },
  { nome: 'Carla Mendes', setor: 'Marketing', lic: 'Standard', pc: 'NTB-003', av: 'Ativo', laps: 'Pendente', pat: 'PAT-0103', win: 'Home' },
  { nome: 'Diego Rocha', setor: 'Garantia da Qualidade', lic: 'Basic', pc: 'NTB-004', av: 'Inativo', laps: 'Aplicado', pat: 'PAT-0104', win: 'Pro' },
  { nome: 'Elisa Prado', setor: 'RH', lic: 'Standard', pc: 'NTB-005', av: 'Ativo', laps: 'Aplicado', pat: '', win: 'Home' },
  { nome: 'Fábio Martins', setor: 'Logística', lic: 'Basic', pc: '' },
  { nome: 'Gabriela Teixeira', setor: 'Assuntos Regulatórios', lic: 'Standard', pc: 'NTB-006', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0106', win: 'Pro' },
  { nome: 'Igor Ramos', setor: 'Produção', lic: 'Basic', pc: 'NTB-007', av: 'Inativo', laps: 'Pendente', pat: 'PAT-0107', win: 'Home' },
  { nome: 'Juliana Freitas', setor: 'Compras', lic: 'Standard', pc: 'NTB-008', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0108', win: 'Pro' },
  { nome: 'Lucas Barbosa', setor: 'TI', lic: 'Standard', pc: 'NTB-009', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0109', win: 'Pro' },
  { nome: 'Mariana Duarte', setor: 'Engenharia e Manutenção', lic: 'Basic', pc: 'NTB-010', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0110', win: 'Home' },
  { nome: 'Otávio Pires', setor: 'Produção', lic: 'Basic', pc: '' },
];

// Colaboradores que "chegam" do Microsoft 365 durante a animação (completam os 15 exemplos e as 100 linhas)
export const incoming: Example[] = [
  { nome: 'Patrícia Gomes', setor: 'Produção/CQ', lic: 'Standard', pc: 'NTB-011', av: 'Ativo', laps: 'Aplicado', pat: 'PAT-0111', win: 'Pro' },
  { nome: 'Rafael Moreira', setor: 'Comercial', lic: 'Basic', pc: 'NTB-012', av: 'Ativo', laps: 'Pendente', pat: '', win: 'Pro' },
  { nome: 'Sofia Cardoso', setor: 'Biotério', lic: 'Standard', pc: 'NTB-013', av: 'Inativo', laps: 'Aplicado', pat: 'PAT-0113', win: 'Home' },
];

// Linha resumida usada no cálculo. n = índice em `incoming` (-1 = já está na planilha)
export type Rec = { s: string; l: 'Standard' | 'Basic'; pc: boolean; av: boolean; laps: boolean; selo: boolean; win: 'Pro' | 'Home' | null; n: number };

const toRec = (e: Example, n: number): Rec => ({
  s: e.setor,
  l: e.lic,
  pc: !!e.pc,
  av: e.av === 'Ativo',
  laps: e.laps === 'Aplicado',
  selo: !!e.pat,
  win: e.pc ? (e.win ?? 'Pro') : null,
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
      const pc = rand() < (s === 'Sócio' ? 0.4 : 0.9);
      recs.push({
        s,
        l: rand() < 0.6 ? 'Standard' : 'Basic',
        pc,
        av: pc && rand() < 0.88,
        laps: pc && rand() < 0.78,
        selo: pc && rand() < 0.9,
        win: pc ? (rand() < 0.8 ? 'Pro' : 'Home') : null,
        n: -1,
      });
    }
  }
  return recs;
}
export const records = buildRecords();

// Ordem fixa dos setores no gráfico (pela planilha completa), para as linhas não pularem durante a animação
export const sectorOrder = [...SECTORS].sort(
  (a, b) => records.filter((r) => r.s === b).length - records.filter((r) => r.s === a).length || SECTORS.indexOf(a) - SECTORS.indexOf(b),
);

export const PEND_TOP = 5;

// Textos (t) e larguras em % (w) de cada elemento do dashboard
export function compute(rows: Rec[]) {
  const t: Record<string, string> = {};
  const w: Record<string, number> = {};
  const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);

  const eq = rows.filter((r) => r.pc);
  const lapsOk = eq.filter((r) => r.laps).length;
  const avOk = eq.filter((r) => r.av).length;
  t.contas = String(rows.length);
  t.equip = String(eq.length);
  t.laps = `${Math.round(pct(lapsOk, eq.length))}%`;
  t['laps:sub'] = `${lapsOk} de ${eq.length}`;
  t.av = `${Math.round(pct(avOk, eq.length))}%`;
  t['av:sub'] = `${avOk} de ${eq.length}`;
  t.semPc = String(rows.length - eq.length);
  t.semSelo = String(eq.filter((r) => !r.selo).length);

  for (const v of ['Standard', 'Basic']) {
    const n = rows.filter((r) => r.l === v).length;
    t[`lic:${v}`] = String(n);
    w[`lic:${v}`] = pct(n, rows.length);
  }
  for (const v of ['Pro', 'Home']) {
    const n = eq.filter((r) => r.win === v).length;
    t[`win:${v}`] = String(n);
    w[`win:${v}`] = pct(n, eq.length);
  }

  // Pendência = antivírus inativo, LAPS pendente ou sem selo, em notebooks da empresa
  const pend = new Map<string, { av: number; laps: number; selo: number }>();
  for (const r of eq) {
    const p = pend.get(r.s) ?? { av: 0, laps: 0, selo: 0 };
    p.av += +!r.av;
    p.laps += +!r.laps;
    p.selo += +!r.selo;
    pend.set(r.s, p);
  }
  const top = [...pend]
    .map(([s, p]) => ({ s, ...p, n: p.av + p.laps + p.selo }))
    .filter((p) => p.n > 0)
    .sort((a, b) => b.n - a.n || SECTORS.indexOf(a.s) - SECTORS.indexOf(b.s))
    .slice(0, PEND_TOP);
  for (let i = 0; i < PEND_TOP; i++) {
    const p = top[i];
    t[`pend:${i}:name`] = p?.s ?? '';
    t[`pend:${i}`] = p ? String(p.n) : '';
    t[`pend:${i}:tip`] = p ? `Antivírus ${p.av} · LAPS ${p.laps} · Selo ${p.selo}` : '';
    w[`pend:${i}`] = p ? pct(p.n, top[0].n) : 0;
  }

  // Contas ativas e dispositivos por setor: a barra clara são as contas, a cheia são os notebooks
  const bySector = SECTORS.map((s) => ({ s, c: rows.filter((r) => r.s === s).length, d: eq.filter((r) => r.s === s).length }));
  const maxC = Math.max(...bySector.map((x) => x.c), 1);
  for (const { s, c, d } of bySector) {
    t[`set:${s}:c`] = String(c);
    t[`set:${s}:d`] = String(d);
    t[`set:${s}:tip`] = `${s}: ${c} contas · ${d} dispositivos`;
    w[`set:${s}:c`] = pct(c, maxC);
    w[`set:${s}:d`] = pct(d, c);
  }

  return { t, w };
}
