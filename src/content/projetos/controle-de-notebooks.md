---
title: Licenças, segurança e custos do Microsoft 365
summary: Um painel que mostra, num lugar só, quem usa qual licença, quais equipamentos ainda não estão seguros e quanto a empresa gasta com isso.
before: Cada colaborador consultado um a um no 365 Admin, sem registro de antivírus, de LAPS ou do custo das licenças.
after: Uma fonte central em três abas, licenças, segurança e custos, com o que já está certo e o que ainda falta.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: Estágio de TI · Hebe's Life Science
---

## O problema

A equipe de TI não tinha uma visão única das contas Microsoft 365 e dos equipamentos. Para saber qual licença cada pessoa usava, em qual computador e se esse computador estava seguro, era preciso consultar o 365 Admin colaborador por colaborador. Antivírus e LAPS não eram registrados em lugar nenhum, e ninguém sabia quanto as licenças custavam para cada setor.

## O que eu entreguei

- **Base em Excel**, com uma linha por conta ou equipamento, extraída do Microsoft 365. Antivírus, LAPS e o motivo de quem não tem equipamento da empresa foram incluídos por decisão da equipe e são preenchidos à mão, com listas suspensas que não aceitam valores fora do padrão.
- **Painel no Power BI** com três abas, cada uma respondendo a uma pergunta:
  - **Licenças:** quantas contas usam cada licença, em cada setor, e quais licenças podem ser revistas.
  - **Segurança:** quais equipamentos estão sem LAPS, sem antivírus ou com uma versão do Windows que precisa mudar, setor por setor.
  - **Custos:** quanto as licenças custam por ano, por mês, por conta e por setor.
- **Filtros por aba**, só os que fazem sentido em cada uma, com dicas ao passar o mouse e um layout próprio para o celular.

## Como funciona

Em poucas palavras, são três passos:

1. **A base.** Uma planilha com uma linha para cada pessoa ou equipamento: nome, e-mail, setor, licenças, antivírus, LAPS e versão do Windows.
2. **A limpeza.** No Power Query, organizo as linhas: separo usuários de contas administrativas, trato as contas com mais de uma licença e marco o que falta de segurança em cada computador.
3. **Os números.** No Power BI, cada conta e cada computador é contado uma vez só, e o custo das licenças é calculado por ano, por mês, por conta e por setor.

### Licenças que podem ser revistas

Uma conta Standard de quem não tem equipamento da empresa poderia, em princípio, ser Basic, que custa bem menos por conta. O painel mostra essas contas e o motivo de cada uma (computador particular, sem computador ou sem motivo informado), mas diz que elas **podem ser revistas**, e não que devem virar Basic: quem trabalha num computador particular pode precisar dos aplicativos do Standard. A decisão fica com quem conhece a rotina de cada pessoa.

### Decisões de design

- **Nenhum número se repete entre as abas.** Antes de criar um visual, eu confiro se a métrica já aparece em outra aba.
- **A aba Licenças mostra só quantidades, e a aba Custos, só valores em reais.**
- **Cada aba tem só os filtros que fazem sentido nela,** com nomes simples, sem termos técnicos como "N/A" ou "Unlicensed".
- **Cada licença tem uma cor fixa,** a mesma em todas as abas.

### Qualidade dos dados

Além das listas suspensas na planilha, o modelo aponta o que pode estar errado na própria base: PCs com dados diferentes entre as linhas, o mesmo selo de patrimônio em PCs diferentes, e-mails fora do domínio da empresa e contas sem setor. A padronização dos nomes de setor foi feita com apoio de IA e revisada por mim.

## Resultado

A planilha e o painel se tornaram a fonte central da equipe de TI para licenças, segurança e custos do Microsoft 365. Localizar um colaborador passou a ser um filtro, saber quanto um setor custa passou a ser um gráfico, e o que falta para a segurança chegar a 100% fica à vista, setor por setor.
