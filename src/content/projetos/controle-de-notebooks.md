---
title: Controle de Notebooks dos Colaboradores
summary: Extração de dados do Microsoft 365 para uma base de colaboradores em Excel, com mini dashboard de KPIs no mesmo arquivo.
problem: A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador e se a máquina estava pronta para uso.
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

- **Nome de usuário** e **e-mail cadastrado**
- **Setor** do colaborador
- **Licenças** Microsoft utilizadas (Standard ou Basic)
- **Nome do PC**
- **Antivírus** ativo ou não
- **LAPS** aplicado ou não
- **Selo de patrimônio**
- **Versão do Windows** (Pro ou Home)

Hoje a planilha tem **100 linhas**, uma por colaborador. A simulação acima mostra 15 exemplos. A tabela possui **filtros** que facilitam a navegação, e a base é atualizada sempre que um novo colaborador entra na empresa.

A coluna **LAPS** indica se o notebook já passou pelo script de segurança desenvolvido pelo gerente de TI. Depois que ele é executado, qualquer instalação fora das diretrizes da empresa passa a pedir liberação com a conta de administrador da TI. O script também registra o notebook no **Microsoft Entra ID**, plataforma onde a equipe faz a supervisão de todos os equipamentos.

## Dashboard

O mini dashboard fica em outra aba, no mesmo arquivo da base de colaboradores, e reúne os **KPIs** e **gráficos dinâmicos** do controle de equipamentos:

- **Filtros** por versão do Windows, licença, status do LAPS e do antivírus, equipamento, selo de patrimônio, setor e pendência
- **6 KPIs:** contas ativas, equipamentos, % de LAPS e % de antivírus (com meta de 100%), contas sem notebook corporativo e equipamentos sem selo de patrimônio
- **Gráficos:** contas ativas por licença, gasto com licenças de antivírus por setor, versão do Windows, setores com mais pendências de segurança e contas ativas e dispositivos por setor
- **Tabelas:** segurança dos notebooks (com e sem LAPS e antivírus), motivo das contas sem notebook corporativo e as listas de pendências de segurança e de cadastro

Ele mostra os principais indicadores de forma clara e ajuda a definir os próximos passos para melhorar o controle dos dispositivos. Quando a base é atualizada e tratada, o dashboard se atualiza junto.

## Resultado

Esse arquivo, com a tabela e o dashboard, é a **principal fonte de consulta de dados centralizados** de cada colaborador. Nele estão todas as informações sobre o dispositivo e o setor onde a pessoa se encontra.

Antes disso, precisávamos consultar individualmente as informações dos usuários no 365 Admin, e ainda não tínhamos todas as informações referentes a um mesmo dispositivo, como o antivírus e o LAPS. Centralizamos tudo e, agora, quando precisamos consultar alguma informação de um colaborador, apenas filtramos pela planilha. Além disso, o dashboard nos mostra o que pode ser melhorado e o que já foi feito até agora, com uma visão tanto geral quanto afunilada pelos KPIs e gráficos.
