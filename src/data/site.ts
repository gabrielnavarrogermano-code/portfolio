// Dados pessoais usados em todo o site. Edite aqui e tudo se atualiza.

// Ano do portfólio (rodapé): vem do ano da publicação, então vira sozinho a cada janeiro.
const ano = new Date().getFullYear();

export const site = {
  ano,
  name: 'Gabriel Navarro Germano',
  description:
    'Gabriel Navarro Germano, estudante de Engenharia de Software em Maringá (PR), procura estágio ou vaga júnior em análise de dados e BI. Projetos em Excel e Power BI.',
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
