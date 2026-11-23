// Os dois idiomas do site. O português fica na raiz (/) e o inglês em /en/.
// Cada componente descobre o idioma pelo endereço da página (idiomaDe) e pega os textos daqui (textos[idioma]).
// Para mudar um texto, edite os dois idiomas juntos.

export type Idioma = 'pt' | 'en';

export const idiomaDe = (url: URL): Idioma => (url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'pt');

// Caminho de uma página no idioma pedido: a home e os estudos de caso
export const caminho = (idioma: Idioma, destino: '' | `#${string}` | `projeto:${string}`) => {
  if (destino.startsWith('projeto:')) {
    const id = destino.slice('projeto:'.length);
    return idioma === 'en' ? `/en/projects/${id}/` : `/projetos/${id}/`;
  }
  return (idioma === 'en' ? '/en/' : '/') + destino;
};

// A mesma página no outro idioma (o botão PT / EN do menu)
export const outroIdioma = (url: URL): string => {
  const p = url.pathname;
  const caso = p.match(/^\/(?:en\/projects|projetos)\/([^/]+)\/?$/);
  if (idiomaDe(url) === 'en') return caso ? `/projetos/${caso[1]}/` : '/';
  return caso ? `/en/projects/${caso[1]}/` : '/en/';
};

// "A, B e C" / "A, B and C"
const lista = (itens: readonly string[], e: string) =>
  itens.length > 1 ? `${itens.slice(0, -1).join(', ')} ${e} ${itens[itens.length - 1]}` : (itens[0] ?? '');

export const textos = {
  pt: {
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    titulo: 'Gabriel Navarro Germano | Análise de Dados',
    descricao: 'Gabriel Navarro Germano, estudante de Engenharia de Software em Maringá (PR), procura estágio ou vaga júnior em análise de dados e BI. Projetos em Excel e Power BI.',
    nav: {
      menu: 'Menu',
      contato: 'Contato',
      fechar: 'Fechar',
      paginas: 'Páginas',
      idiomaGrupo: 'Idioma',
      links: [
        { id: 'apresentacao', label: 'Apresentação' },
        { id: 'projetos', label: 'Projetos' },
        { id: 'habilidades', label: 'Como eu trabalho' },
        { id: 'contato', label: 'Contato' },
      ],
    },
    capa: {
      nomeSr: 'Gabriel Navarro Germano, Análise de Dados & BI',
      foto: 'Foto de Gabriel Navarro Germano',
      negocio: 'negócio',
      negocioTexto: 'Começo pela decisão, não pelo gráfico.',
      contato: 'Entre em contato',
      curriculo: 'Currículo',
      curriculoRotulo: 'Baixar currículo',
      dados: 'Dados',
      dadosTexto: 'Excel e Power BI, da planilha ao painel.',
      funcao: 'Análise de dados e BI · Maringá, PR',
    },
    prazer: {
      titulo: 'Prazer, Gabriel',
      origem: 'Origem',
      origemTexto: 'Meu avô aluga lojas para outros <b>empreendedores</b>, e meu pai teve um restaurante no mesmo lugar. Com eles aprendi que o número é a base da decisão, mas não decide sozinho: eles acompanhavam as contas e também ouviam o que clientes e lojistas diziam que podia melhorar.',
      descoberta: 'Descoberta',
      descobertaTexto: 'Na <b>Engenharia de Software</b>, percebi que perguntas que eu ouvia em casa, como qual loja rende mais ou em que mês o restaurante enche, tinham resposta na <b>análise de dados</b>.',
      agora: 'Agora',
      agoraTexto: 'No estágio de TI, fiz meu primeiro painel no Power BI e aprendi que ele só é usado quando quem não é técnico consegue filtrar sozinho.',
      experiencia: 'Experiência',
      atual: 'Atual',
      cargo: 'Estagiário de TI',
      empresa: "Hebe's Life Science, indústria farmacêutica. Atendo chamados e cuido dos acessos ao Microsoft 365. Organizando essas informações, montei o painel de licenças, segurança e custos da TI.",
      ferramentas: 'Ferramentas',
      formacao: 'Formação',
      curso: 'Engenharia de Software',
      semestres: (s: number, t: number) => `${s}º de ${t} semestres`,
      semestreCurto: (s: number, t: number) => `UniCesumar, ${s}º de ${t}`,
      estudando: 'Estudando agora',
      estudos: 'SQL, DAX no Power BI e data storytelling',
    },
    projetos: {
      antes: 'Antes',
      depois: 'Depois',
      ler: 'Ler estudo de caso',
      abrir: (titulo: string) => `Abrir o estudo de caso: ${titulo}`,
      dica: 'Passe o mouse para ver a página de segurança',
      // "Estágio de TI · Hebe's Life Science" + "Extração e Tratamento" + ferramentas, numa frase só
      ficha: (contexto: string | undefined, etapa: string, ferramentas: readonly string[]) =>
        `Feito no ${contexto ? contexto.split(' · ')[0].replace(/^E/, 'e') : 'estágio'}: ${etapa.toLowerCase()} com ${lista(ferramentas, 'e')}.`,
    },
    trabalho: {
      titulo: 'Como eu trabalho',
      exemplo: 'Exemplo',
      lista: 'Princípios',
      principios: [
        { short: 'Problema', title: 'Primeiro o problema, depois o dado', text: 'Um pedido de relatório quase sempre esconde uma decisão. Descobrir qual é define o que vale medir.' },
        { short: 'Contexto', title: 'Número sozinho não decide nada', text: 'Um total só diz algo quando tem com o que ser comparado: o mês passado, a meta, o que é normal.' },
        { short: 'Linguagem', title: 'Falo a língua de quem decide', text: 'Quem decide não precisa saber o que é taxa de vacância. Precisa saber quantas lojas estão vazias.' },
        { short: 'Prioridade', title: 'Impacto e esforço definem a prioridade', text: 'Nem toda análise vale o tempo que leva. Começo pelo que mais ajuda a decisão com menos trabalho.' },
      ],
      d1: {
        pedidoTag: 'O pedido',
        pedido: '“Quero um relatório dos aluguéis.”',
        perguntaTag: 'A pergunta de negócio',
        perguntaAntes: 'Quais lojistas estão ',
        perguntaDestaque: 'atrasando o pagamento',
        perguntaDepois: ', e desde quando?',
        medidas: ['Dias de atraso', 'Valor em aberto', 'Histórico de pagamento'],
      },
      d2: {
        tag: 'Faturamento do restaurante no mês',
        moeda: 'R$',
        valor: '48 mil',
        vsMes: 'Em relação ao mês passado',
        meta: 'Meta do mês',
        atencao: 'Atenção',
        falta: 'faltam R$ 4 mil para a meta',
      },
      d3: {
        tecnicoTag: 'O relatório técnico',
        tecnico: 'taxa_vacancia = 0,083',
        quemDecideTag: 'Para quem decide',
        destaque: '1 em cada 12',
        frase: ' lojas está vazia.',
      },
      d4: {
        tag: 'Impacto e esforço',
        impacto: 'Mais impacto',
        esforco: 'Mais esforço',
        quadrantes: [
          { task: 'Cobrar quem está atrasado', tag: 'Faz primeiro', win: true },
          { task: 'Prever a ocupação do ano', tag: 'Planeja', win: false },
          { task: 'Trocar as cores do relatório', tag: 'Se sobrar tempo', win: false },
          { task: 'Refazer todo o histórico', tag: 'Evita', win: false },
        ],
      },
      // O bastidor de cada cena: a ferramenta e o trecho que fazem o princípio virar entrega
      bastidorRotulo: 'Na prática',
      bastidor: [
        { ferramenta: 'Excel', codigo: '=HOJE()-[@Vencimento]', nota: 'os dias de atraso de cada lojista' },
        { ferramenta: 'Power BI', codigo: '% da meta = DIVIDE([Faturamento], [Meta])', nota: 'medida DAX com a comparação' },
        { ferramenta: 'Power BI', codigo: 'taxa_vacancia → "Lojas vazias"', nota: 'o nome da medida no modelo' },
        { ferramenta: 'Excel', codigo: '=SE(E([@Impacto]="Alto"; [@Esforço]="Baixo"); "Faz primeiro"; …)', nota: 'a regra da matriz numa fórmula' },
      ],
    },
    contato: {
      titulo: 'Vamos conversar?',
      frase: 'Procuro estágio ou vaga júnior em análise de dados e BI. Moro em Maringá (PR) e topo remoto ou híbrido.',
      copiarRotulo: 'Copiar o e-mail',
      copiado: 'E-mail copiado',
      erro: 'Não deu para copiar. Selecione o e-mail e copie.',
      curriculo: 'Currículo em PDF',
    },
    rodape: { topo: 'Voltar ao topo', email: 'E-mail' },
    caso: {
      voltar: 'Voltar aos projetos',
      leitura: (m: number) => `${m} min de leitura`,
      ferramentas: 'Ferramentas',
      onde: 'Onde',
      entrega: 'Entrega',
      verDashboard: 'Ver dashboard',
      codigo: 'Código',
      simulacao: 'Simulação interativa, com dados fictícios',
      avisoRelatorio: '',
      nesteEstudo: 'Neste estudo',
      gostou: 'Quer conversar sobre uma vaga?',
      conversar: 'Vamos conversar',
    },
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    titulo: 'Gabriel Navarro Germano | Data Analysis',
    descricao: 'Gabriel Navarro Germano, Software Engineering student in Maringá, Brazil, looking for an internship or junior role in data analysis and BI. Projects in Excel and Power BI.',
    nav: {
      menu: 'Menu',
      contato: 'Contact',
      fechar: 'Close',
      paginas: 'Pages',
      idiomaGrupo: 'Language',
      links: [
        { id: 'apresentacao', label: 'About' },
        { id: 'projetos', label: 'Projects' },
        { id: 'habilidades', label: 'How I work' },
        { id: 'contato', label: 'Contact' },
      ],
    },
    capa: {
      nomeSr: 'Gabriel Navarro Germano, Data Analysis & BI',
      foto: 'Photo of Gabriel Navarro Germano',
      negocio: 'business',
      negocioTexto: 'I start from the decision, not the chart.',
      contato: 'Get in touch',
      curriculo: 'Résumé',
      curriculoRotulo: 'Download résumé',
      dados: 'Data',
      dadosTexto: 'Excel and Power BI, from spreadsheet to dashboard.',
      funcao: 'Data analysis and BI · Maringá, Brazil',
    },
    prazer: {
      titulo: "Hi, I'm Gabriel",
      origem: 'Roots',
      origemTexto: 'My grandfather rents out stores to other <b>entrepreneurs</b>, and my father once ran a restaurant in the same place. From them I learned that numbers are the basis of a decision, but they do not decide alone: they kept track of the figures and also listened to what customers and tenants said could be better.',
      descoberta: 'Discovery',
      descobertaTexto: 'In <b>Software Engineering</b>, I realized that questions I heard at home, like which store earns the most or which month fills the restaurant, could be answered with <b>data analysis</b>.',
      agora: 'Now',
      agoraTexto: "In my IT internship, I built my first Power BI dashboard and learned that it only gets used when someone who isn't technical can filter it on their own.",
      experiencia: 'Experience',
      atual: 'Current',
      cargo: 'IT Intern',
      empresa: "Hebe's Life Science, pharmaceutical industry. I handle support tickets and manage Microsoft 365 access. Organizing that information, I built the IT team's licenses, security and costs dashboard.",
      ferramentas: 'Tools',
      formacao: 'Education',
      curso: 'Software Engineering',
      semestres: (s: number, t: number) => `Semester ${s} of ${t}`,
      semestreCurto: (s: number, t: number) => `UniCesumar, semester ${s} of ${t}`,
      estudando: 'Studying now',
      estudos: 'SQL, DAX in Power BI and data storytelling',
    },
    projetos: {
      antes: 'Before',
      depois: 'After',
      ler: 'Read the case study',
      abrir: (titulo: string) => `Open the case study: ${titulo}`,
      dica: 'Hover to see the security page',
      ficha: (contexto: string | undefined, etapa: string, ferramentas: readonly string[]) =>
        `Built during my ${contexto ? contexto.split(' · ')[0] : 'internship'}: ${etapa.toLowerCase()} with ${lista(ferramentas, 'and')}.`,
    },
    trabalho: {
      titulo: 'How I work',
      exemplo: 'Example',
      lista: 'Principles',
      principios: [
        { short: 'Problem', title: 'The problem first, then the data', text: 'A report request almost always hides a decision. Finding out which one defines what is worth measuring.' },
        { short: 'Context', title: 'A number alone decides nothing', text: 'A total only says something when it has something to be compared with: last month, the target, what is normal.' },
        { short: 'Language', title: 'I speak the language of whoever decides', text: "Decision makers don't need to know what a vacancy rate is. They need to know how many stores are empty." },
        { short: 'Priority', title: 'Impact and effort set the priority', text: 'Not every analysis is worth the time it takes. I start with what helps the decision most for the least work.' },
      ],
      d1: {
        pedidoTag: 'The request',
        pedido: '“I want a report on the rents.”',
        perguntaTag: 'The business question',
        perguntaAntes: 'Which tenants are ',
        perguntaDestaque: 'paying late',
        perguntaDepois: ', and since when?',
        medidas: ['Days late', 'Amount due', 'Payment history'],
      },
      d2: {
        tag: 'Restaurant revenue this month',
        moeda: 'R$',
        valor: '48k',
        vsMes: 'Compared with last month',
        meta: 'Monthly target',
        atencao: 'Warning',
        falta: 'R$ 4k short of the target',
      },
      d3: {
        tecnicoTag: 'The technical report',
        tecnico: 'vacancy_rate = 0.083',
        quemDecideTag: 'For the decision maker',
        destaque: '1 in every 12',
        frase: ' stores is empty.',
      },
      d4: {
        tag: 'Impact and effort',
        impacto: 'More impact',
        esforco: 'More effort',
        quadrantes: [
          { task: 'Chase late payments', tag: 'Do first', win: true },
          { task: 'Forecast the year\'s occupancy', tag: 'Plan', win: false },
          { task: 'Change the report colors', tag: 'If time allows', win: false },
          { task: 'Rebuild the whole history', tag: 'Avoid', win: false },
        ],
      },
      bastidorRotulo: 'In practice',
      bastidor: [
        { ferramenta: 'Excel', codigo: '=TODAY()-[@DueDate]', nota: 'days late for each tenant' },
        { ferramenta: 'Power BI', codigo: '% of target = DIVIDE([Revenue], [Target])', nota: 'a DAX measure with the comparison' },
        { ferramenta: 'Power BI', codigo: 'vacancy_rate → "Empty stores"', nota: 'the measure name in the model' },
        { ferramenta: 'Excel', codigo: '=IF(AND([@Impact]="High", [@Effort]="Low"), "Do first", …)', nota: 'the matrix rule as a formula' },
      ],
    },
    contato: {
      titulo: "Let's talk?",
      frase: "I'm looking for an internship or junior role in data analysis and BI. I live in Maringá, Brazil, and I'm open to remote or hybrid work.",
      copiarRotulo: 'Copy the email address',
      copiado: 'Email copied',
      erro: "Couldn't copy. Select the email and copy it.",
      curriculo: 'Résumé (PDF)',
    },
    rodape: { topo: 'Back to top', email: 'Email' },
    caso: {
      voltar: 'Back to projects',
      leitura: (m: number) => `${m} min read`,
      ferramentas: 'Tools',
      onde: 'Where',
      entrega: 'Deliverable',
      verDashboard: 'View dashboard',
      codigo: 'Code',
      simulacao: 'Interactive simulation, with fictional data',
      avisoRelatorio: 'The report stays in Portuguese, the language it was delivered in.',
      nesteEstudo: 'In this study',
      gostou: 'Liked the project?',
      conversar: "Let's talk",
    },
  },
} as const;

export const textosDe = (url: URL) => textos[idiomaDe(url)];
