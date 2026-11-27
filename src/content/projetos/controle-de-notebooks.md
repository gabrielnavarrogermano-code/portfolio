---
title: Licenças, segurança e custos do Microsoft 365
summary: Um painel que mostra, num lugar só, quem usa qual licença, quais equipamentos ainda não estão seguros e quanto isso custa, com um histórico que se monta sozinho todo mês.
before: Cada colaborador consultado um a um no 365 Admin, sem registro de antivírus, de LAPS ou do custo das licenças.
after: Quatro abas, licenças, segurança, custos e evolução mês a mês, e uma foto da base guardada sozinha todo dia 1.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI, Power Automate]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: Estágio de TI · Hebe's Life Science
---

## O problema

A equipe de TI não tinha uma visão única das contas Microsoft 365 e dos equipamentos. Saber a licença de cada pessoa e se o computador dela estava seguro exigia consultar o 365 Admin um por um. Antivírus, LAPS e custo por setor não eram registrados.

## O que eu entreguei

- **Base em Excel** extraída do Microsoft 365, com os preços das licenças numa aba própria: reajustar um preço é trocar uma célula.
- **Painel no Power BI** em quatro abas: **Licenças** (quantidades), **Segurança** (o que falta em cada equipamento), **Custos** (R$ por ano, mês, conta e setor) e **Evolução** (o que mudou desde o mês anterior, item por item).
- **Histórico mensal:** no dia 1, um fluxo do Power Automate guarda uma foto da planilha e me avisa por e-mail. Com essas fotos, o painel monta a evolução e um relatório de uma página que explica em frases o que mudou, que eu exporto em PDF.

### Decisões que fazem diferença

- **Cada conta é contada uma vez** (por e-mail) e cada equipamento também (pelo nome do PC). O antivírus de 3 anos entra no custo anual dividido por 3.
- **Nenhum número se repete entre as abas.** Licenças mostra só quantidades e Custos só reais.
- **Erros aparecem em vez de passarem em silêncio:** coluna apagada trava a atualização, mês sem o dado aparece como "sem dado" e o painel aponta patrimônio repetido e conta sem setor.
- **Toda mudança é conferida:** comparo todas as medidas antes e depois de mexer numa regra.

## Resultado

Localizar um colaborador virou um filtro, saber quanto um setor custa virou um gráfico, e o que mudou no mês fica registrado sem ninguém montar planilha.
