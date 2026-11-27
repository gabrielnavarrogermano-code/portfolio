// Dados fictícios da planilha usuarios_office365 e o cálculo do painel (Licenças, Segurança e Custos).
// As regras são as do painel real: conta ativa contada por e-mail, equipamento por nome do PC, antivírus pago a cada
// 3 anos (no custo anual entra ÷ 3) e os preços das licenças. Nomes, setores e quantidades são inventados.
// O mesmo cálculo roda no servidor (estado inicial, sem JS) e no navegador (animação e filtros).

// ---------- Preços fictícios e redondos (R$ por ano; o antivírus é por equipamento, a cada 3 anos) ----------
// Não são os preços pagos pela empresa: a simulação não pode dar pista de valores reais
export const PRECO = { Standard: 950, Basic: 380, Adobe: 1400 } as const;
export const AV_PRECO = 450;
export const AV_ANOS = 3;
// Simulação do preço do antivírus, na aba Custos
export const AV_SIMULACAO = Array.from({ length: 9 }, (_, i) => 250 + i * 50);

// ---------- Setores fictícios (contas por setor na planilha completa). "Sem setor" fica sempre por último ----------
// Uma empresa menor e com outros setores que a real: nenhuma contagem pode lembrar os números verdadeiros
export const SEM_SETOR = '⚠ Sem setor';
const SETORES: [string, number][] = [
  ['Vendas', 11],
  ['Operações', 9],
  ['Atendimento', 7],
  ['Qualidade', 6],
  ['Financeiro', 6],
  ['Marketing', 5],
  ['Jurídico', 4],
  ['TI', 4],
  ['Pessoas', 4],
  ['Compras', 3],
  ['Expedição', 3],
  ['Diretoria', 2],
  [SEM_SETOR, 1],
];
export const SETOR_NOMES = SETORES.map(([s]) => s);

// ---------- Tipos ----------
export type Tipo = 'Usuário' | 'Conta administradora' | 'Dispositivo compartilhado';
export type Win = 'Windows 11 PRO' | 'Windows 11 HOME' | 'Windows 10 PRO';
export const WINDOWS: Win[] = ['Windows 10 PRO', 'Windows 11 HOME', 'Windows 11 PRO'];
export const MOTIVOS = [
  ['particular', 'Computador particular'],
  ['naoTem', 'Não tem notebook próprio'],
  ['nenhum', 'Sem motivo informado'],
] as const;
export type Motivo = (typeof MOTIVOS)[number][0];

// Uma linha da planilha. n = ordem de chegada dos colaboradores novos (-1 = já estava na planilha)
export type Rec = {
  nome: string;
  email: string;
  setor: string;
  funcao: string;
  tipo: Tipo;
  lic: 'Standard' | 'Basic';
  adobe: boolean;
  pc: string; // '' = sem equipamento da empresa
  win: Win | null;
  laps: boolean;
  av: boolean;
  selo: string;
  motivo: Motivo | null; // só para quem não tem equipamento
  n: number;
};

// ---------- Linhas de exemplo (as que aparecem na planilha) ----------
type Ex = Omit<Rec, 'email' | 'n' | 'motivo' | 'win' | 'selo'> & { win?: Win; motivo?: Motivo; selo?: string };
const ex = (e: Ex, n = -1): Rec => ({
  ...e,
  email: emailDe(e.nome),
  win: e.pc ? (e.win ?? 'Windows 11 PRO') : null,
  motivo: e.pc ? null : (e.motivo ?? 'nenhum'),
  selo: e.pc ? (e.selo ?? `PAT-${e.pc.slice(-3)}`) : '',
  n,
});

function emailDe(nome: string) {
  const [p, ...r] = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ');
  return `${p}.${r.at(-1) ?? 'conta'}@empresa.com.br`;
}

const U = 'Usuário' as const;
export const exemplos: Rec[] = [
  ex({ nome: 'Ana Souza', setor: 'Financeiro', funcao: 'Analista financeira', tipo: U, lic: 'Standard', adobe: false, pc: 'NTB-101', laps: true, av: true }),
  ex({ nome: 'Bruno Lima', setor: 'Vendas', funcao: 'Representante', tipo: U, lic: 'Standard', adobe: false, pc: '', laps: false, av: false, motivo: 'particular' }),
  ex({ nome: 'Carla Mendes', setor: 'Marketing', funcao: 'Designer', tipo: U, lic: 'Standard', adobe: true, pc: 'NTB-103', win: 'Windows 11 HOME', laps: false, av: true }),
  ex({ nome: 'Diego Rocha', setor: 'Operações', funcao: 'Supervisor', tipo: U, lic: 'Basic', adobe: false, pc: 'NTB-104', laps: true, av: false }),
];
export const chegando: Rec[] = [
  ex({ nome: 'Patrícia Gomes', setor: 'Jurídico', funcao: 'Advogada', tipo: U, lic: 'Standard', adobe: true, pc: 'NTB-111', laps: true, av: true }, 0),
  ex({ nome: 'Rafael Moreira', setor: 'Vendas', funcao: 'Vendedor', tipo: U, lic: 'Standard', adobe: false, pc: 'NTB-112', laps: false, av: true }, 1),
  ex({ nome: 'Sofia Cardoso', setor: 'Expedição', funcao: 'Assistente de expedição', tipo: U, lic: 'Basic', adobe: false, pc: '', laps: false, av: false, motivo: 'naoTem' }, 2),
];

// ---------- O resto da planilha: gerador fixo (o resultado é sempre o mesmo) ----------
const PRIMEIROS = ['Alice', 'Arthur', 'Beatriz', 'Caio', 'Camila', 'Daniel', 'Débora', 'Eduardo', 'Fernanda', 'Felipe', 'Gabriela', 'Gustavo', 'Helena', 'Henrique', 'Isabela', 'João', 'Júlia', 'Leonardo', 'Larissa', 'Marcelo', 'Marina', 'Mateus', 'Natália', 'Nicolas', 'Paula', 'Pedro', 'Renata', 'Rodrigo', 'Sabrina', 'Thiago', 'Vanessa', 'Vinícius'];
const SOBRENOMES = ['Alves', 'Araújo', 'Batista', 'Campos', 'Cardoso', 'Castro', 'Costa', 'Dias', 'Farias', 'Fernandes', 'Lopes', 'Machado', 'Nunes', 'Oliveira', 'Pereira', 'Ribeiro', 'Santos', 'Silva', 'Vieira', 'Xavier'];

function montar(): Rec[] {
  let semente = 11;
  const r = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;
  const recs = [...exemplos, ...chegando];
  let k = 0;
  let pcN = 200;
  for (const [setor, total] of SETORES) {
    for (let i = recs.filter((x) => x.setor === setor).length; i < total; i++) {
      const nome = `${PRIMEIROS[(k * 7) % PRIMEIROS.length]} ${SOBRENOMES[(k * 3 + Math.floor(k / PRIMEIROS.length)) % SOBRENOMES.length]}`;
      k++;
      // Contas não pessoais: uma administradora no TI e um dispositivo compartilhado no Atendimento
      const tipo: Tipo =
        setor === 'TI' && i === 1 ? 'Conta administradora'
        : setor === 'Atendimento' && i === 0 ? 'Dispositivo compartilhado'
        : U;
      const temPc = tipo === 'Dispositivo compartilhado' || (tipo === U && r() < (setor === 'Diretoria' ? 0.5 : 0.88));
      const wr = r();
      const win: Win = wr < 0.9 ? 'Windows 11 PRO' : wr < 0.97 ? 'Windows 11 HOME' : 'Windows 10 PRO';
      const pro = win !== 'Windows 11 HOME';
      const m = r();
      const pc = temPc ? `NTB-${pcN++}` : '';
      recs.push({
        nome: tipo === U ? nome : tipo === 'Conta administradora' ? 'Administrador' : `Estação ${setor}`,
        email: tipo === U ? emailDe(nome) : tipo === 'Conta administradora' ? 'admin.ti@empresa.com.br' : `estacao.${setor.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}@empresa.com.br`,
        setor,
        funcao: tipo === U ? '' : tipo,
        tipo,
        lic: tipo === 'Dispositivo compartilhado' ? 'Basic' : r() < 0.62 ? 'Standard' : 'Basic',
        adobe: setor === 'Marketing' ? r() < 0.6 : setor === 'Jurídico' ? r() < 0.5 : false,
        pc,
        win: temPc ? win : null,
        laps: temPc && (pro ? r() < 0.93 : r() < 0.3),
        av: temPc && r() < 0.9,
        selo: temPc ? `PAT-${pc.slice(-3)}` : '',
        motivo: temPc ? null : m < 0.35 ? 'particular' : m < 0.85 ? 'naoTem' : 'nenhum',
        n: -1,
      });
    }
  }
  return recs;
}
export const registros = montar();

// Ordem fixa dos setores nos gráficos (pela planilha completa), para as barras não pularem durante a animação.
// Setor com mais contas primeiro; "Sem setor" por último
export const ordemSetores = [...SETOR_NOMES].sort((a, b) =>
  a === SEM_SETOR ? 1 : b === SEM_SETOR ? -1 : registros.filter((x) => x.setor === b).length - registros.filter((x) => x.setor === a).length,
);

// ---------- Filtros ----------
// Setor vale em todas as abas; os demais, só na aba deles (como no painel real)
export type Sel = { setor: string; lic: string[]; tipo: string[]; win: string[]; falta: string[]; av: string };
export const SEL_VAZIA: Sel = { setor: '', lic: [], tipo: [], win: [], falta: [], av: '' };

export const FILTRO_LIC = [
  ['Standard', 'Microsoft 365 Standard'],
  ['Basic', 'Microsoft 365 Basic'],
  ['Adobe', 'Adobe Acrobat Pro'],
  ['Antivírus', 'Antivírus (Kaspersky)'],
] as const;
export const FILTRO_TIPO: Tipo[] = ['Usuário', 'Conta administradora', 'Dispositivo compartilhado'];
export const FILTRO_FALTA = [
  ['laps', 'Sem LAPS'],
  ['av', 'Sem antivírus'],
  ['home', 'Windows 11 HOME'],
] as const;

const temLic = (x: Rec, v: string) => (v === 'Adobe' ? x.adobe : v === 'Antivírus' ? !!x.pc && x.av : x.lic === v);
const falta = (x: Rec, v: string) => !!x.pc && (v === 'laps' ? !x.laps : v === 'av' ? !x.av : x.win === 'Windows 11 HOME');
// Várias opções no mesmo filtro = linhas com qualquer uma delas
const algum = (vals: string[], teste: (v: string) => boolean) => !vals.length || vals.some(teste);

export const filtrar = {
  lic: (rs: Rec[], s: Sel) => rs.filter((x) => (!s.setor || x.setor === s.setor) && algum(s.lic, (v) => temLic(x, v)) && algum(s.tipo, (v) => x.tipo === v)),
  seg: (rs: Rec[], s: Sel) => rs.filter((x) => (!s.setor || x.setor === s.setor) && algum(s.win, (v) => x.win === v) && algum(s.falta, (v) => falta(x, v))),
  cus: (rs: Rec[], s: Sel) => rs.filter((x) => !s.setor || x.setor === s.setor),
};

// Pendências de segurança de um equipamento, separadas por " · "
export const pendencias = (x: Rec) =>
  !x.pc ? '' : [!x.laps && 'Sem LAPS', !x.av && 'Sem antivírus', x.win === 'Windows 11 HOME' && 'Windows HOME'].filter(Boolean).join(' · ');

// ---------- Formatação ----------
const num = (v: number) => Math.round(v).toLocaleString('pt-BR');
export const brl = (v: number) => `R$ ${num(v)}`;
export const brl2 = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const mil = (v: number) => `R$ ${(v / 1000).toFixed(1).replace('.', ',')} Mil`;
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const pct1 = (a: number, b: number) => `${pct(a, b).toFixed(1).replace('.', ',')}%`;
const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

// Contagens sem repetição: conta por e-mail, equipamento por nome do PC
const contas = (rs: Rec[]) => new Set(rs.map((x) => x.email)).size;
const equips = (rs: Rec[]) => new Set(rs.filter((x) => x.pc).map((x) => x.pc)).size;

// Custo anual das licenças de um grupo de linhas (o antivírus de 3 anos entra ÷ 3)
function custoDe(l: Rec[], avPreco = AV_PRECO) {
  const std = contas(l.filter((x) => x.lic === 'Standard')) * PRECO.Standard;
  const basic = contas(l.filter((x) => x.lic === 'Basic')) * PRECO.Basic;
  const adobe = contas(l.filter((x) => x.adobe)) * PRECO.Adobe;
  const av = (equips(l.filter((x) => x.av)) * avPreco) / AV_ANOS;
  return { std, basic, m365: std + basic, adobe, av, total: std + basic + adobe + av };
}

// ---------- O cálculo do painel ----------
// t = textos e w = larguras/alturas em % de cada elemento, com chaves por aba (lic:, seg:, cus:)
export function calcular(base: Rec[], s: Sel) {
  const t: Record<string, string> = {};
  const w: Record<string, number> = {};
  const porSetor = (rs: Rec[]) => new Map(ordemSetores.map((st) => [st, rs.filter((x) => x.setor === st)]));

  // ===== Licenças: só quantidades =====
  {
    const rs = filtrar.lic(base, s);
    const std = rs.filter((x) => x.lic === 'Standard');
    t['lic:contas'] = String(contas(rs));
    t['lic:contas:sub'] = `${plural(rs.length, 'registro', 'registros')} nos filtros`;
    t['lic:std'] = String(contas(std));
    t['lic:basic'] = String(contas(rs.filter((x) => x.lic === 'Basic')));
    t['lic:adobe'] = String(contas(rs.filter((x) => x.adobe)));
    t['lic:av'] = String(equips(rs.filter((x) => x.av)));

    // Licenças que podem ser revistas: Standard sem equipamento (poderiam ser Basic) e contas não pessoais pagas
    const stdSemEq = std.filter((x) => !x.pc);
    t['lic:rev'] = String(contas(stdSemEq));
    t['lic:np'] = String(contas(rs.filter((x) => x.tipo !== 'Usuário')));
    const maxMot = Math.max(...MOTIVOS.map(([k]) => stdSemEq.filter((x) => x.motivo === k).length), 1);
    for (const [k] of MOTIVOS) {
      const quem = stdSemEq.filter((x) => x.motivo === k);
      t[`lic:mot:${k}`] = String(quem.length);
      w[`lic:mot:${k}`] = pct(quem.length, maxMot);
      t[`lic:mot:${k}:tip`] = quem.length ? quem.map((x) => `${x.nome} (${x.setor})`).join('\n') : 'Ninguém';
    }

    // Licenças por setor: Standard, Basic e Adobe, empilhadas; largura relativa ao setor com mais licenças
    const setores = porSetor(rs);
    const tot = (l: Rec[]) => contas(l.filter((x) => x.lic === 'Standard')) + contas(l.filter((x) => x.lic === 'Basic')) + contas(l.filter((x) => x.adobe));
    const maxS = Math.max(...[...setores.values()].map(tot), 1);
    for (const [st, l] of setores) {
      const v = { std: contas(l.filter((x) => x.lic === 'Standard')), basic: contas(l.filter((x) => x.lic === 'Basic')), adobe: contas(l.filter((x) => x.adobe)) };
      const total = v.std + v.basic + v.adobe;
      w[`lic:set:${st}`] = pct(total, maxS);
      for (const [k, n] of Object.entries(v)) {
        t[`lic:set:${st}:${k}`] = n ? String(n) : '';
        w[`lic:set:${st}:${k}`] = pct(n, total);
      }
      t[`lic:set:${st}:tip`] = `${st}: ${plural(contas(l), 'conta ativa', 'contas ativas')} · Standard ${v.std} · Basic ${v.basic} · Adobe ${v.adobe}`;
    }
  }

  // ===== Segurança =====
  {
    const rs = filtrar.seg(base, s);
    const pcs = new Map<string, Rec>();
    for (const x of rs) if (x.pc && !pcs.has(x.pc)) pcs.set(x.pc, x);
    const eq = [...pcs.values()];
    const n = eq.length;
    const conta = (f: (x: Rec) => boolean) => eq.filter(f).length;
    const vals: Record<string, number> = {
      laps: conta((x) => !x.laps),
      av: conta((x) => !x.av),
      home: conta((x) => x.win === 'Windows 11 HOME'),
      w10: conta((x) => x.win === 'Windows 10 PRO'),
      prolaps: conta((x) => x.win !== 'Windows 11 HOME' && !x.laps),
      part: contas(rs.filter((x) => !x.pc && x.motivo === 'particular')),
    };
    for (const [k, v] of Object.entries(vals)) {
      t[`seg:${k}`] = String(v);
      t[`seg:${k}:st`] = v ? 'ruim' : 'bom';
    }
    t['seg:laps:sub'] = `cobertura ${pct1(n - vals.laps, n)} · meta 100%`;
    t['seg:av:sub'] = `cobertura ${pct1(n - vals.av, n)} · meta 100%`;

    // Equipamentos por setor: com e sem pendência de segurança; altura relativa ao setor com mais equipamentos
    const setores = porSetor(eq);
    const maxS = Math.max(...[...setores.values()].map((l) => l.length), 1);
    for (const [st, l] of setores) {
      const com = l.filter((x) => pendencias(x)).length;
      t[`seg:set:${st}:com`] = com ? String(com) : '';
      t[`seg:set:${st}:sem`] = l.length - com ? String(l.length - com) : '';
      w[`seg:set:${st}:com`] = pct(com, maxS);
      w[`seg:set:${st}:sem`] = pct(l.length - com, maxS);
      t[`seg:set:${st}:tip`] = l.length
        ? `${st}: ${plural(l.length, 'equipamento', 'equipamentos')}\n` + l.map((x) => `${x.pc} · ${x.nome}${pendencias(x) ? ` · ${pendencias(x)}` : ''}`).join('\n')
        : `${st}: sem equipamentos`;
    }
  }

  // ===== Custos: só valores em R$ =====
  {
    const rs = filtrar.cus(base, s);
    const avPreco = s.av ? Number(s.av) : AV_PRECO;
    const custo = (l: Rec[]) => custoDe(l, avPreco);
    const c = custo(rs);
    const ativas = contas(rs);
    t['cus:total'] = brl(c.total);
    t['cus:mes'] = brl(c.total / 12);
    t['cus:conta'] = brl(ativas ? c.total / ativas : 0);
    t['cus:avc'] = brl(equips(rs.filter((x) => x.av)) * avPreco);
    t['cus:avc:sub'] = `licença de 3 anos · ${brl(avPreco)} por equipamento`;

    // Para onde vai o dinheiro: rosca com Standard, Adobe, antivírus e Basic
    for (const k of ['std', 'adobe', 'av', 'basic'] as const) {
      t[`cus:don:${k}`] = mil(c[k]);
      t[`cus:don:${k}:pct`] = `${Math.round(pct(c[k], c.total))}%`;
      w[`cus:don:${k}`] = pct(c[k], c.total);
    }

    // Por setor: custo anual empilhado (M365, Adobe e antivírus) e custo por conta ativa
    const setores = porSetor(rs);
    const custos = new Map([...setores].map(([st, l]) => [st, custo(l)]));
    const maxS = Math.max(...[...custos.values()].map((x) => x.total), 1);
    const porConta = new Map([...setores].map(([st, l]) => [st, contas(l) ? custos.get(st)!.total / contas(l) : 0]));
    const maxC = Math.max(...porConta.values(), 1);
    for (const [st, l] of setores) {
      const x = custos.get(st)!;
      w[`cus:set:${st}`] = pct(x.total, maxS);
      for (const k of ['m365', 'adobe', 'av'] as const) {
        // O valor só vai escrito na parte que tem espaço para ele
        t[`cus:set:${st}:${k}`] = x[k] && pct(x[k], maxS) > 24 ? mil(x[k]) : '';
        w[`cus:set:${st}:${k}`] = pct(x[k], x.total);
      }
      t[`cus:set:${st}:tip`] = `${st}: ${brl(x.total)} por ano · M365 ${brl(x.m365)} · Adobe ${brl(x.adobe)} · antivírus ${brl(x.av)}`;
      const pc = porConta.get(st)!;
      t[`cus:cc:${st}`] = pc ? brl(pc) : '';
      w[`cus:cc:${st}`] = pct(pc, maxC);
      t[`cus:cc:${st}:tip`] = `${st}: ${brl(x.total)} por ano ÷ ${plural(contas(l), 'conta ativa', 'contas ativas')} = ${brl(pc)} por conta`;
    }
  }

  evolucao(base, t, w);
  return { t, w };
}

// Lista "Equipamentos com pendência de segurança" (aba Segurança), um equipamento por linha
export function listaPendencias(base: Rec[], s: Sel) {
  const vistos = new Set<string>();
  return filtrar
    .seg(base, s)
    .filter((x) => x.pc && pendencias(x) && !vistos.has(x.pc) && vistos.add(x.pc))
    .sort((a, b) => ordemSetores.indexOf(a.setor) - ordemSetores.indexOf(b.setor));
}

// ---------- Evolução (aba Evolução) ----------
// Como no painel real, a aba compara a planilha de hoje com a última foto mensal (a cópia que o Power Automate guarda
// no dia 1). A foto de outubro é fictícia: a planilha de hoje com algumas mudanças desfeitas, para a lista do que
// mudou ter um pouco de cada tipo. Os colaboradores que chegam na animação entram na lista sozinhos.
export const MES_FOTO = 'out';
export const MES_HOJE = 'nov';

function montarFoto(): Rec[] {
  const hoje = registros.filter((x) => x.n < 0);
  const gerados = hoje.slice(exemplos.length);
  const pessoa = (x: Rec) => x.tipo === 'Usuário';
  // Quem entrou em Vendas recebeu o notebook de quem saiu
  const troca = gerados.find((x) => pessoa(x) && x.pc && x.setor === 'Vendas')!;
  // Uma conta passou de Basic para Standard
  const licenca = gerados.find((x) => pessoa(x) && x.lic === 'Standard' && x !== troca)!;
  // Um equipamento perdeu o antivírus
  const semAv =
    gerados.find((x) => x.pc && !x.av && x.laps && x.win !== 'Windows 11 HOME' && x !== troca && x !== licenca) ??
    gerados.find((x) => x.pc && !x.av && x !== troca && x !== licenca)!;
  // Um Windows 10 antigo saiu e a pessoa ficou sem equipamento da empresa
  const devolveu = gerados.find((x) => pessoa(x) && !x.pc && x !== licenca)!;
  return hoje
    .filter((x) => x.nome !== 'Carla Mendes' && x.nome !== 'Diego Rocha')
    .map((x): Rec => {
      if (x === troca) return { ...x, nome: 'Lucas Teixeira', email: emailDe('Lucas Teixeira') };
      if (x === licenca) return { ...x, lic: 'Basic' };
      if (x === semAv) return { ...x, av: true };
      if (x === devolveu) return { ...x, pc: 'NTB-099', win: 'Windows 10 PRO', laps: true, av: true, selo: 'PAT-099', motivo: null };
      if (x.nome === 'Ana Souza') return { ...x, laps: false };
      return x;
    });
}
export const fotoAnterior = montarFoto();

// ----- O que mudou no mês: a foto × a planilha de hoje, pelas mesmas chaves do painel (PC e e-mail) -----
export const TIPOS_MOV = [
  ['Equipamento novo', 'ciano'],
  ['Equipamento saiu', 'prata'],
  ['Nova pendência', 'vermelho'],
  ['Pendência resolvida', 'verde'],
  ['Trocou de usuário', 'ouro'],
  ['Conta nova', 'ciano'],
  ['Conta removida', 'prata'],
  ['Licença mudou', 'roxo'],
] as const;
export type Mov = { tipo: number; equip: string; pessoa: string; setor: string; detalhe: string };

const nomeLic = (x: Rec) => [`M365 ${x.lic}`, x.adobe && 'Adobe Acrobat Pro'].filter(Boolean).join(' + ');
const primeiroPor = (rs: Rec[], chave: (x: Rec) => string) => {
  const m = new Map<string, Rec>();
  for (const x of rs) if (chave(x) && !m.has(chave(x))) m.set(chave(x), x);
  return m;
};
const partes = (s: string) => (s ? s.split(' · ') : []);

export function movimentacao(antes: Rec[], agora: Rec[]): Mov[] {
  const mov: Mov[] = [];
  const add = (tipo: number, x: Rec, detalhe: string, equip = x.pc || '—') => mov.push({ tipo, equip, pessoa: x.nome, setor: x.setor, detalhe });

  const [pcA, pcN] = [primeiroPor(antes, (x) => x.pc), primeiroPor(agora, (x) => x.pc)];
  for (const [pc, x] of pcN) {
    const a = pcA.get(pc);
    if (!a) {
      add(0, x, pendencias(x) ? `chegou com pendência: ${pendencias(x)}` : `${x.win} · sem pendência`);
      continue;
    }
    if (a.nome !== x.nome) add(4, x, `antes era de ${a.nome}`);
    const [pA, pN] = [partes(pendencias(a)), partes(pendencias(x))];
    const novas = pN.filter((p) => !pA.includes(p));
    const resolvidas = pA.filter((p) => !pN.includes(p));
    if (novas.length) add(2, x, novas.join(' · '));
    if (resolvidas.length) add(3, x, resolvidas.join(' · '));
  }
  for (const [pc, a] of pcA) if (!pcN.has(pc)) add(1, a, `${a.win} · não está mais na planilha`);

  const [emA, emN] = [primeiroPor(antes, (x) => x.email), primeiroPor(agora, (x) => x.email)];
  for (const [e, x] of emN) {
    const a = emA.get(e);
    if (!a) add(5, x, nomeLic(x));
    else if (nomeLic(a) !== nomeLic(x)) add(7, x, `${nomeLic(a)} → ${nomeLic(x)}`);
  }
  for (const [e, a] of emA) if (!emN.has(e)) add(6, a, nomeLic(a), '—');

  return mov.sort((a, b) => a.tipo - b.tipo);
}

// ----- Resumo de um mês (empresa toda, sem filtros) -----
function resumo(rs: Rec[]) {
  const eq = [...primeiroPor(rs, (x) => x.pc).values()];
  const n = eq.length;
  return {
    eq: n,
    semLaps: eq.filter((x) => !x.laps).length,
    semAv: eq.filter((x) => !x.av).length,
    pend: eq.filter((x) => pendencias(x)).length,
    custo: custoDe(rs),
  };
}

// Meses antes da foto: diferenças fixas em relação a ela. null = a planilha daquele mês ainda não tinha a coluna,
// e o gráfico mostra "sem dado" em vez de zero (como no painel real)
export const MESES = ['jun', 'jul', 'ago', 'set', MES_FOTO, MES_HOJE] as const;
const ANTES: { eq: number; laps: number; av: number | null }[] = [
  { eq: -4, laps: 6, av: null },
  { eq: -3, laps: 5, av: 5 },
  { eq: -2, laps: 3, av: 3 },
  { eq: -1, laps: 2, av: 2 },
];
export const SERIES_EVO = [
  ['laps', 'Com LAPS', 'ouro'],
  ['av', 'Com antivírus', 'ciano'],
  ['ok', 'Sem pendência de segurança', 'verde'],
] as const;

const virgula = (v: number, casas = 1) => v.toFixed(casas).replace('.', ',');
const sinal = (v: number, txt = String(Math.abs(v))) => (v > 0 ? `+${txt}` : v < 0 ? `−${txt}` : 'igual');

function evolucao(base: Rec[], t: Record<string, string>, w: Record<string, number>) {
  const A = resumo(fotoAnterior);
  const N = resumo(base);
  const de = (a: string, n: string) => `${MES_FOTO} ${a} → ${MES_HOJE} ${n}`;
  const tom = (d: number, melhora: 1 | -1 | 0) => (!d || !melhora ? 'neutro' : d * melhora > 0 ? 'bom' : 'ruim');

  // Cards: o número grande é a variação desde a foto, para não repetir os valores das outras abas
  const dPend = N.pend - A.pend;
  t['evo:pend'] = sinal(dPend);
  t['evo:pend:sub'] = de(String(A.pend), String(N.pend));
  t['evo:pend:st'] = tom(dPend, -1);

  // % compara os valores já arredondados (evita "+0,0 pp")
  const [avA, avN] = [pct(A.eq - A.semAv, A.eq), pct(N.eq - N.semAv, N.eq)].map((v) => Number(v.toFixed(1)));
  const dAv = Number((avN - avA).toFixed(1));
  t['evo:av'] = sinal(dAv, `${virgula(Math.abs(dAv))} pp`);
  t['evo:av:sub'] = de(`${virgula(avA)}%`, `${virgula(avN)}%`);
  t['evo:av:st'] = tom(dAv, 1);

  const dEq = N.eq - A.eq;
  t['evo:eq'] = sinal(dEq);
  t['evo:eq:sub'] = de(String(A.eq), String(N.eq));
  t['evo:eq:st'] = 'neutro';

  const dCusto = N.custo.total - A.custo.total;
  t['evo:custo'] = sinal(Math.round(dCusto), brl(Math.abs(dCusto)));
  t['evo:custo:sub'] = de(brl(A.custo.total), brl(N.custo.total));
  t['evo:custo:st'] = Math.round(dCusto) > 0 ? 'alta' : tom(Math.round(dCusto), -1);

  // Segurança mês a mês: % dos equipamentos, uma linha por série
  const meses = [
    ...ANTES.map((d) => {
      const eq = A.eq + d.eq;
      const semLaps = A.semLaps + d.laps;
      const semAv = d.av === null ? null : A.semAv + d.av;
      // Sem pendência só existe se o mês tem LAPS e antivírus
      const ok = semAv === null ? null : 100 - pct(Math.max(semLaps, semAv) + 2, eq);
      return { laps: 100 - pct(semLaps, eq), av: semAv === null ? null : 100 - pct(semAv, eq), ok };
    }),
    ...[A, N].map((m) => ({ laps: 100 - pct(m.semLaps, m.eq), av: 100 - pct(m.semAv, m.eq), ok: 100 - pct(m.pend, m.eq) })),
  ];
  const todos = meses.flatMap((m) => [m.laps, m.av, m.ok]).filter((v): v is number => v !== null);
  const folga = (Math.max(...todos) - Math.min(...todos) || 1) * 0.25;
  const lo = Math.min(...todos) - folga;
  const hi = Math.max(...todos) + folga;
  const aria: string[] = [];
  for (const [k, rotulo] of SERIES_EVO) {
    const pts: string[] = [];
    meses.forEach((m, i) => {
      const v = m[k];
      if (v === null) return;
      const x = 5 + (i * 90) / (meses.length - 1);
      const y = 100 - ((v - lo) / (hi - lo)) * 100;
      pts.push(`${x} ${y}`);
      w[`evo:lg:${k}:${i}`] = y;
      t[`evo:lg:${k}:${i}`] = `${Math.round(v)}%`;
    });
    t[`evo:lg:${k}:d`] = `M ${pts.join(' L ')}`;
    aria.push(`${rotulo}: ${meses.map((m, i) => `${MESES[i]} ${m[k] === null ? 'sem dado' : `${Math.round(m[k]!)}%`}`).join(', ')}`);
  }
  t['evo:lg:aria'] = `Segurança mês a mês. ${aria.join('. ')}`;

  // Cascata do custo anual: a foto, a diferença de cada licença (some se não mudou) e hoje
  const passos: [string, number, number][] = [];
  let acum = A.custo.total;
  for (const k of ['std', 'basic', 'adobe', 'av'] as const) {
    const d = N.custo[k] - A.custo[k];
    passos.push([k, acum, acum + d]);
    acum += d;
  }
  const valores = [A.custo.total, N.custo.total, ...passos.flatMap(([, a, b]) => [a, b])];
  const margem = (Math.max(...valores) - Math.min(...valores) || 1000) * 0.8;
  const base0 = Math.min(...valores) - margem;
  const topo = Math.max(...valores) + margem * 0.5;
  const alt = (v: number) => ((v - base0) / (topo - base0)) * 100;
  const barra = (k: string, de0: number, ate: number) => {
    w[`evo:cas:${k}:b`] = alt(Math.min(de0, ate));
    w[`evo:cas:${k}:h`] = Math.max(alt(Math.max(de0, ate)) - alt(Math.min(de0, ate)), 0.8);
  };
  barra('ini', base0, A.custo.total);
  barra('fim', base0, N.custo.total);
  t['evo:cas:ini'] = mil(A.custo.total);
  t['evo:cas:fim'] = mil(N.custo.total);
  for (const [k, a, b] of passos) {
    const d = Math.round(b - a);
    barra(k, a, b);
    t[`evo:cas:${k}`] = sinal(d, brl(Math.abs(d)));
    t[`evo:cas:${k}:st`] = d > 0 ? 'alta' : 'bom';
    t[`evo:cas:${k}:oculto`] = d ? '' : '1';
  }

  t['evo:mov:sub'] = `Última foto (${MES_FOTO}) × planilha de hoje · ${plural(movimentacao(fotoAnterior, base).length, 'mudança', 'mudanças')}`;
}

// Rosca: círculo de perímetro 100; cada fatia começa onde a anterior terminou, com uma folga pequena entre elas
export function rosca(fatias: number[]) {
  let ini = 0;
  return fatias.map((p) => {
    const g = p > 1 ? 0.6 : 0;
    const d = { dash: `${Math.max(p - g, 0)} ${100 - p + g}`, offset: String(-ini) };
    ini += p;
    return d;
  });
}
