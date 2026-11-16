// Dados pessoais usados em todo o site. Edite aqui e tudo se atualiza.

// Ano do portfólio: vem do ano da publicação, então vira sozinho a cada janeiro.
// `anoEmDois` é o formato dos rótulos do site: "20 26".
const ano = new Date().getFullYear();

export const site = {
  ano,
  anoEmDois: `${String(ano).slice(0, 2)} ${String(ano).slice(2)}`,
  name: 'Gabriel Navarro Germano',
  description:
    'Portfólio de Gabriel Navarro Germano: análise de dados, business intelligence e engenharia de software.',
  email: 'gabrielnavarrogermano@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gabrielnavarrogermano/',
  github: 'https://github.com/gabrielnavarrogermano-code',
  // Para anexar o currículo, salve o PDF em public/curriculo.pdf.
  // O botão só aparece no site quando esse arquivo existe.
  curriculo: '/curriculo.pdf',
  // Nome do arquivo quando a pessoa baixa o currículo
  curriculoNome: 'Curriculo-Gabriel-Navarro-Germano.pdf',
  // Progresso da faculdade (barrinhas em "Trajetória"): atualize o semestre a cada período
  curso: { semestre: 2, total: 8 },
};
