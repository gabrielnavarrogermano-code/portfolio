---
title: Controle de Notebooks dos Colaboradores
summary: Extração de dados do Microsoft 365 para uma base de colaboradores em Excel, com dashboard de KPIs no Power BI que se atualiza junto com a planilha.
before: Cada colaborador consultado um a um no 365 Admin, sem registro de antivírus e LAPS.
after: Uma fonte central de consulta, com KPIs do que já foi feito e do que ainda falta.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: Estágio de TI · Hebe's Life Science
deliverable: Base em Excel + dashboard no Power BI
stats:
  - { value: '100', label: 'linhas na base' }
  - { value: '9', label: 'colunas por colaborador' }
  - { value: '4', label: 'regras de negócio' }
  - { value: '3', label: 'páginas no dashboard' }
---

> Projeto real, desenvolvido no estágio de TI da Hebe's Life Science. A simulação acima usa dados fictícios.

## O problema

A equipe de TI não tinha uma visão única dos notebooks. Para saber com quem estava cada máquina, qual licença Microsoft a pessoa usava e se o equipamento estava seguro, era preciso consultar o 365 Admin colaborador por colaborador. Antivírus e LAPS não eram registrados em lugar nenhum.

## O que eu entreguei

- **Base em Excel**, com uma linha por colaborador, extraída do Microsoft 365. As colunas de antivírus e LAPS foram incluídas por decisão da equipe e preenchidas manualmente.
- **Dashboard no Power BI** com três páginas (Licenças, Dispositivos e Segurança), filtros que valem para todas, meta de 100% para LAPS e antivírus e o custo do Kaspersky projetado pelas licenças de 3 anos, para prever a renovação.

## Por dentro

Para quem avalia a parte técnica: como a base está organizada e como os indicadores são calculados.

### A base

Uma tabela, com uma linha por conta ativa:

- **Nome de usuário**, **e-mail** e **setor**
- **Licença** Microsoft (Standard ou Basic)
- **Nome do PC** e **selo de patrimônio**
- **Antivírus** (Kaspersky): ativo ou inativo
- **LAPS**: aplicado ou pendente
- **Versão do Windows** (Pro ou Home)

### Regras de negócio

1. Um notebook compartilhado conta uma vez só.
2. Windows Home conta como pendência de segurança.
3. Notebook sem antivírus é pendência crítica.
4. Toda conta sem notebook tem um motivo registrado.

### Medidas

A regra 1 está na própria medida: os indicadores contam **nomes de PC distintos**, e não linhas. Contas sem notebook ficam de fora.

```
Notebooks = DISTINCTCOUNTNOBLANK ( Base[Nome PC] )

% LAPS =
DIVIDE (
    CALCULATE ( [Notebooks], Base[LAPS] = "Aplicado" ),
    [Notebooks]
)

Status LAPS =
SWITCH (
    TRUE (),
    [% LAPS] >= 1,    "Meta batida",
    [% LAPS] >= 0.85, "Atenção",
    "Crítico"
)
```

O antivírus segue a mesma estrutura. O status transforma o percentual em uma decisão: abaixo de 85%, o indicador é crítico.

### Qualidade dos dados

O dashboard também aponta o que pode estar errado na própria base: PCs com dados divergentes entre linhas, selo de patrimônio repetido em PCs diferentes, e-mails fora do domínio e contas sem setor. A padronização dos nomes de setor foi feita com apoio de IA e revisada por mim.

## Resultado

A base e o dashboard se tornaram a fonte central de consulta da equipe de TI. Localizar um colaborador passou a ser um filtro, e os indicadores mostram, com meta e status, o que já está em conformidade e o que ainda falta.
