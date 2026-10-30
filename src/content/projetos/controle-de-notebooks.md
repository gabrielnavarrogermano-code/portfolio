---
title: Controle de Notebooks dos Colaboradores
summary: Extração de dados do Microsoft 365 para uma base de colaboradores em Excel, com mini dashboard de KPIs no mesmo arquivo.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Gráficos Dinâmicos]
order: 1
demo: notebooks
---

> Projeto real, feito no estágio de TI na Hebe's Life Science. A simulação acima usa dados fictícios.

## O problema

A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador, qual licença Microsoft ele usa e se a máquina estava pronta para uso, com todas as dependências instaladas.

## Extração

Os dados dos colaboradores são importados do **Microsoft 365**, que já é a fonte oficial de quem entra na empresa.

## Tratamento

As informações são tratadas e organizadas na aba de base do arquivo, com uma linha por colaborador:

- **Nome** e **e-mail**
- **Licença Microsoft** utilizada (Standard ou Basic)
- **Nome do computador**
- **Dependências** instaladas corretamente
- **Antivírus** ativo ou não
- **LAPS** aplicado ou não
- **Versão do Windows** (Pro ou Home)
- **Selo de patrimônio**

A base é atualizada sempre que um novo colaborador entra na empresa.

A coluna **LAPS** indica se o notebook já passou pelo script de segurança desenvolvido pelo gerente de TI. Depois que ele é executado, qualquer instalação fora das diretrizes da empresa passa a pedir liberação com a conta de administrador da TI. O script também registra o notebook no **Microsoft Entra ID**, plataforma onde a equipe faz a supervisão de todos os equipamentos.

## Dashboard

O mini dashboard fica em outra aba, no mesmo arquivo da base de colaboradores, e reúne os **KPIs** e **gráficos dinâmicos** do controle de equipamentos. Quando a base é atualizada e tratada, o dashboard se atualiza junto.

## Resultado

A equipe de TI enxerga em um só lugar quem está com cada equipamento e quais máquinas ainda precisam de ajuste.
