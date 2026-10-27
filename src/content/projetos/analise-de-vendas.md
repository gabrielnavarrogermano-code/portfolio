---
title: Análise de Vendas e Sazonalidade
summary: Quais produtos e meses puxam o faturamento? Dashboard interativo para responder em segundos.
kind: Dashboard
tools: [SQL, PostgreSQL, Tableau]
order: 1
exemplo: true
# dashboard: https://public.tableau.com/...
# repo: https://github.com/gabrielnavarrogermano-code/...
---

> **Projeto de exemplo.** Substitua este texto pelo seu projeto real. Mantenha a estrutura: ela deixa a leitura rápida.

## O problema

Uma pergunta de negócio clara, em 1 ou 2 frases. Exemplo: *"Em quais meses as vendas caem e quais categorias são responsáveis por isso?"*

## Os dados

- **Fonte:** de onde vieram os dados (Kaggle, dados.gov.br, API...)
- **Volume:** quantas linhas e colunas, qual período
- **Tratamento:** o que você limpou (nulos, duplicados, tipos de data)

```sql
SELECT date_trunc('month', data_venda) AS mes,
       categoria,
       SUM(valor) AS faturamento
FROM vendas
GROUP BY 1, 2
ORDER BY 1;
```

## A análise

Explique em poucos tópicos como você chegou às respostas e insira um print ou o link do dashboard.

## Insights

- **Insight 1:** o achado mais importante, com um número
- **Insight 2:** outro padrão relevante
- **Recomendação:** o que a empresa deveria fazer com isso

## O que aprendi

Uma ou duas frases sobre uma dificuldade e como você a resolveu.
