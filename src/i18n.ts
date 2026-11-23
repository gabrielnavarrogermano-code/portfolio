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
    descricao: 'Portfólio de Gabriel Navarro Germano: análise de dados, business intelligence e engenharia de software.',
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
      negocioTexto: 'Começo pela decisão que o número precisa ajudar a tomar, não pelo gráfico.',
      contato: 'Entre em contato',
      curriculo: 'Currículo',
      curriculoRotulo: 'Baixar currículo',
      dados: 'Dados',
      dadosTexto: 'Excel, Power BI e ETL para transformar planilhas soltas em dashboards que a equipe usa.',
    },
    prazer: {
      titulo: 'Prazer, Gabriel',
      origem: 'Origem',
      origemTexto: 'Cresci entre <b>empreendedores</b>, meu pai e meu avô, vendo de perto o que funcionava e o que podia melhorar em um negócio.',
      descoberta: 'Descoberta',
      descobertaTexto: 'Cursando <b>Engenharia de Software</b>, encontrei na <b>análise de dados</b> um jeito de levar os números para dentro dessas decisões.',
      agora: 'Agora',
      agoraTexto: 'No estágio, aprendi que um dashboard só funciona se quem não é técnico consegue usar sozinho.',
      experiencia: 'Experiência',
      atual: 'Atual',
      cargo: 'Estagiário de TI',
      empresa: "Hebe's Life Science, indústria farmacêutica. Atendo chamados e cuido de acessos: vejo de perto como cada área trabalha e do que ela precisa. Foi daí que saiu o controle de notebooks.",
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
        `${contexto ? `${contexto.replace(' · ', ' na ')}. ` : ''}${etapa.charAt(0)}${etapa.slice(1).toLowerCase()} com ${lista(ferramentas, 'e')}.`,
    },
    trabalho: {
      titulo: 'Como eu trabalho',
      exemplo: 'Exemplo',
      lista: 'Princípios',
      principios: [
        { short: 'Problema', title: 'Primeiro o problema, depois o dado', text: 'Um pedido de relatório quase sempre esconde uma decisão. Descobrir qual é define o que vale medir.' },
        { short: 'Contexto', title: 'Número sozinho não decide nada', text: 'Um total só diz algo quando tem com o que ser comparado: o mês passado, a meta, o que é normal.' },
        { short: 'Linguagem', title: 'Falo a língua de quem decide', text: 'Quem decide não precisa saber o que é churn. Precisa saber quantos clientes perdeu.' },
        { short: 'Prioridade', title: 'Impacto e esforço definem a prioridade', text: 'Nem toda análise vale o tempo que leva. Começo pelo que mais ajuda a decisão com menos trabalho.' },
      ],
      d1: {
        pedidoTag: 'O pedido',
        pedido: '“Quero um dashboard de vendas.”',
        perguntaTag: 'A pergunta de negócio',
        perguntaAntes: 'Quais clientes estão ',
        perguntaDestaque: 'deixando de comprar',
        perguntaDepois: ', e por quê?',
        medidas: ['Último pedido', 'Frequência de compra', 'Ticket médio'],
      },
      d2: {
        tag: 'Faturamento do mês',
        moeda: 'R$',
        valor: '120 mil',
        vsMes: 'Em relação ao mês passado',
        meta: 'Meta do mês',
        atencao: 'Atenção',
        falta: 'faltam R$ 10 mil para a meta',
      },
      d3: {
        tecnicoTag: 'O relatório técnico',
        tecnico: 'churn_mensal = 0,042',
        quemDecideTag: 'Para quem decide',
        destaque: '1 em cada 24',
        frase: ' clientes saiu este mês.',
      },
      d4: {
        tag: 'Impacto e esforço',
        impacto: 'Mais impacto',
        esforco: 'Mais esforço',
        quadrantes: [
          { task: 'Alerta de clientes inativos', tag: 'Faz primeiro', win: true },
          { task: 'Modelo de previsão de vendas', tag: 'Planeja', win: false },
          { task: 'Trocar as cores do relatório', tag: 'Se sobrar tempo', win: false },
          { task: 'Refazer todo o histórico', tag: 'Evita', win: false },
        ],
      },
    },
    contato: {
      titulo: 'Vamos conversar?',
      frase: 'Me conta o problema. A gente começa pela pergunta.',
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
      gostou: 'Gostou do projeto?',
      conversar: 'Vamos conversar',
    },
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    titulo: 'Gabriel Navarro Germano | Data Analysis',
    descricao: 'Portfolio of Gabriel Navarro Germano: data analysis, business intelligence and software engineering.',
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
      negocioTexto: 'I start from the decision the numbers need to support, not from the chart.',
      contato: 'Get in touch',
      curriculo: 'Résumé',
      curriculoRotulo: 'Download résumé',
      dados: 'Data',
      dadosTexto: 'Excel, Power BI and ETL to turn scattered spreadsheets into dashboards the team actually uses.',
    },
    prazer: {
      titulo: "Hi, I'm Gabriel",
      origem: 'Roots',
      origemTexto: 'I grew up among <b>entrepreneurs</b>, my father and my grandfather, seeing up close what worked in a business and what could be better.',
      descoberta: 'Discovery',
      descobertaTexto: 'While studying <b>Software Engineering</b>, I found in <b>data analysis</b> a way to bring numbers into those decisions.',
      agora: 'Now',
      agoraTexto: "The internship taught me that a dashboard only works if someone who isn't technical can use it on their own.",
      experiencia: 'Experience',
      atual: 'Current',
      cargo: 'IT Intern',
      empresa: "Hebe's Life Science, pharmaceutical industry. I handle support tickets and manage access, which shows me up close how each department works and what it needs. That's where the laptop tracking project came from.",
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
        `${contexto ? `${contexto.replace(' · ', ' at ')}. ` : ''}${etapa.charAt(0)}${etapa.slice(1).toLowerCase()} with ${lista(ferramentas, 'and')}.`,
    },
    trabalho: {
      titulo: 'How I work',
      exemplo: 'Example',
      lista: 'Principles',
      principios: [
        { short: 'Problem', title: 'The problem first, then the data', text: 'A report request almost always hides a decision. Finding out which one defines what is worth measuring.' },
        { short: 'Context', title: 'A number alone decides nothing', text: 'A total only says something when it has something to be compared with: last month, the target, what is normal.' },
        { short: 'Language', title: 'I speak the language of whoever decides', text: "Decision makers don't need to know what churn is. They need to know how many customers they lost." },
        { short: 'Priority', title: 'Impact and effort set the priority', text: 'Not every analysis is worth the time it takes. I start with what helps the decision most for the least work.' },
      ],
      d1: {
        pedidoTag: 'The request',
        pedido: '“I want a sales dashboard.”',
        perguntaTag: 'The business question',
        perguntaAntes: 'Which customers are ',
        perguntaDestaque: 'buying less',
        perguntaDepois: ', and why?',
        medidas: ['Last order', 'Purchase frequency', 'Average ticket'],
      },
      d2: {
        tag: 'Monthly revenue',
        moeda: 'R$',
        valor: '120k',
        vsMes: 'Compared with last month',
        meta: 'Monthly target',
        atencao: 'Warning',
        falta: 'R$ 10k short of the target',
      },
      d3: {
        tecnicoTag: 'The technical report',
        tecnico: 'monthly_churn = 0.042',
        quemDecideTag: 'For the decision maker',
        destaque: '1 in every 24',
        frase: ' customers left this month.',
      },
      d4: {
        tag: 'Impact and effort',
        impacto: 'More impact',
        esforco: 'More effort',
        quadrantes: [
          { task: 'Inactive customer alert', tag: 'Do first', win: true },
          { task: 'Sales forecasting model', tag: 'Plan', win: false },
          { task: 'Change the report colors', tag: 'If time allows', win: false },
          { task: 'Rebuild the whole history', tag: 'Avoid', win: false },
        ],
      },
    },
    contato: {
      titulo: "Let's talk?",
      frase: 'Tell me the problem. We start with the question.',
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
