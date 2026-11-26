---
title: Licenças, segurança e custos do Microsoft 365
summary: Um painel que mostra, num lugar só, quem usa qual licença, quais equipamentos ainda não estão seguros e quanto a empresa gasta com isso, com um relatório que chega sozinho por e-mail todo mês.
before: Cada colaborador consultado um a um no 365 Admin, sem registro de antivírus, de LAPS ou do custo das licenças.
after: Uma fonte central em quatro abas, licenças, segurança, custos e comparação mês a mês, e um relatório em PDF por e-mail no dia 1 de cada mês.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI, Power Automate]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: Estágio de TI · Hebe's Life Science
---

## O problema

A equipe de TI não tinha uma visão única das contas Microsoft 365 e dos equipamentos. Saber qual licença cada pessoa usava e se o computador dela estava seguro exigia consultar o 365 Admin colaborador por colaborador. Antivírus e LAPS não eram registrados, e ninguém sabia quanto as licenças custavam por setor.

## O que eu entreguei

- **Base em Excel** extraída do Microsoft 365, com uma linha por conta ou equipamento e listas suspensas para os campos preenchidos à mão.
- **Painel no Power BI** com quatro abas: **Licenças** (quantas contas usam cada uma, por setor), **Segurança** (o que falta em cada equipamento), **Custos** (quanto as licenças custam por ano, mês, conta e setor) e **Comparação** (gráficos de linha mês a mês das licenças, dos custos e da % de pendências, com a variação em relação ao mês anterior).
- **Relatório mensal automático:** um fluxo no Power Automate gera um PDF que compara os dois últimos meses e o envia por e-mail no dia 1 de cada mês, às 06:00.

## Como funciona

1. **A base.** Uma planilha com nome, e-mail, setor, licenças, antivírus, LAPS e versão do Windows de cada pessoa ou equipamento.
2. **A limpeza.** No Power Query, separo usuários de contas administrativas, trato contas com mais de uma licença e marco o que falta de segurança.
3. **Os números.** No Power BI, cada conta e cada computador é contado uma vez só, e o custo é calculado por ano, mês, conta e setor.
4. **O envio.** No dia 1 de cada mês, às 06:00, o Power Automate gera o relatório em PDF e o manda por e-mail. Ele compara os dois últimos meses (no envio de 1º de dezembro, outubro contra novembro) e lista o que variou, o que foi adicionado e o que foi removido.

### Decisões de design

- **Nenhum número se repete entre Licenças, Segurança e Custos;** a Comparação só mostra como eles mudam de um mês para o outro. A aba Licenças mostra só quantidades, enquanto a aba Custos mostra só valores em reais.
- **Cada licença tem uma cor fixa** e cada aba tem só os filtros que fazem sentido nela, com nomes simples.
- **Contas Standard de quem não tem equipamento da empresa aparecem como "podem ser revistas",** não como "devem virar Basic": a decisão fica com quem conhece a rotina de cada pessoa.
- **O próprio modelo aponta erros na base,** como o mesmo patrimônio em PCs diferentes ou contas sem setor.

## Resultado

O painel virou a fonte central da equipe de TI para licenças, segurança e custos do Microsoft 365. Localizar um colaborador passou a ser um filtro, saber quanto um setor custa passou a ser um gráfico, e as mudanças do mês chegam por e-mail sem ninguém precisar pedir.
