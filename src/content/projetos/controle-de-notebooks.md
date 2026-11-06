---
title: Controle de Notebooks dos Colaboradores
summary: Extração de dados do Microsoft 365 para uma base de colaboradores em Excel, com dashboard de KPIs no Power BI que se atualiza junto com a planilha.
problem: A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador e se a máquina estava pronta para uso.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
---

> Projeto real, feito no estágio de TI na Hebe's Life Science. A simulação acima usa dados fictícios.

## O problema

A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador, qual licença Microsoft ele usa e se a máquina estava pronta para uso, com todas as dependências instaladas.

## Extração

Os dados dos colaboradores são importados do **Microsoft 365**, que já é a fonte oficial de quem entra na empresa.

## Tratamento

As informações são tratadas e organizadas em uma planilha de usuários no Excel, com uma linha por colaborador:

- **Nome de usuário** e **e-mail cadastrado**
- **Setor** do colaborador
- **Licenças** Microsoft utilizadas (Standard ou Basic)
- **Nome do PC**
- **Antivírus** (Kaspersky) ativo ou não
- **LAPS** aplicado ou não
- **Selo de patrimônio**
- **Versão do Windows** (Pro ou Home)

Hoje a planilha tem **100 linhas**, uma por colaborador. A simulação acima mostra 15 exemplos. A tabela possui **filtros** que facilitam a navegação, e a base é atualizada sempre que um novo colaborador entra na empresa.

A coluna **LAPS** indica se o notebook já passou pelo script de segurança desenvolvido pelo gerente de TI. Depois que ele é executado, qualquer instalação fora das diretrizes da empresa passa a pedir liberação com a conta de administrador da TI. O script também registra o notebook no **Microsoft Entra ID**, plataforma onde a equipe faz a supervisão de todos os equipamentos.

## Dashboard

O dashboard foi feito no **Power BI**, conectado à planilha de usuários. Ele começou como uma aba do próprio arquivo do Excel e depois foi levado para o Power BI, separado em três páginas para não juntar tudo em uma tela só:

- **Licenças:** licenças do Microsoft 365 em uso, no total e por tipo (Standard ou Basic), o gasto com elas em 12 meses, no total e por setor, e as pendências de cadastro da planilha
- **Dispositivos:** notebooks em uso, contas sem notebook corporativo e o motivo, o gasto com notebooks e antivírus, no total e por setor, e as contas e os notebooks de cada setor
- **Segurança:** % de LAPS e % de antivírus (com meta de 100%), notebooks com pendência de segurança, versão do Windows e os setores com mais pendências, separadas por tipo

Os gráficos por setor mostram os 10 maiores setores, e os menores aparecem somados em uma linha só, para não esmagar as barras.

Os **filtros** ficam em um painel lateral, como no Power BI, e valem para as três páginas: versão do Windows, licença, status do LAPS e do antivírus, equipamento, selo de patrimônio, setor e pendência (de segurança, de cadastro ou sem pendência). Os filtros em uso aparecem como etiquetas no topo do relatório, e cada uma pode ser tirada sozinha. Eles também podem ser combinados: ao escolher, por exemplo, um setor e o status "Inativo" do antivírus, todos os KPIs, gráficos e tabelas são recalculados só com as contas que atendem aos dois. Isso permite ir da visão geral da empresa até um setor ou um tipo de pendência específico. Na simulação acima, os filtros e as páginas também funcionam.

As páginas de licenças e de dispositivos têm o seu próprio custo. Na de licenças, o gasto com o **Microsoft 365** é calculado pelos 12 meses de cada licença em uso. Na de dispositivos, entram a compra dos notebooks e as licenças comerciais do **Kaspersky**, que têm valor fixo, uma por notebook com antivírus ativo, e valem **3 anos** e vencem juntas, o que ajuda a prever o custo da renovação. Na simulação, todos os valores são fictícios.

O dashboard mostra os principais indicadores de forma clara e ajuda a definir os próximos passos para melhorar o controle dos dispositivos. Sempre que a planilha de usuários é alterada, o Power BI atualiza o dashboard com os novos dados.

## Resultado

A planilha, junto com o dashboard no Power BI, é a **principal fonte de consulta de dados centralizados** de cada colaborador. Nele estão todas as informações sobre o dispositivo e o setor onde a pessoa se encontra.

Antes disso, precisávamos consultar individualmente as informações dos usuários no 365 Admin, e ainda não tínhamos todas as informações referentes a um mesmo dispositivo, como o antivírus e o LAPS. Centralizamos tudo e, agora, quando precisamos consultar alguma informação de um colaborador, apenas filtramos pela planilha. Além disso, o dashboard nos mostra o que pode ser melhorado e o que já foi feito até agora, com uma visão tanto geral quanto afunilada pelos KPIs e gráficos.
