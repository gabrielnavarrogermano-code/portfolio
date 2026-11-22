---
title: Controle de Notebooks dos Colaboradores
summary: Extração de dados do Microsoft 365 para uma base de colaboradores em Excel, com dashboard de KPIs no Power BI que se atualiza junto com a planilha.
problem: A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador e se a máquina estava pronta para uso.
kind: Extração e Tratamento
tools: [Microsoft 365, Excel, Power BI]
order: 1
demo: notebooks
cover: ../../assets/projetos/notebooks-licencas.png
coverHover: ../../assets/projetos/notebooks-seguranca.png
context: Estágio de TI · Hebe's Life Science
deliverable: Base em Excel + dashboard no Power BI
result: A base e o dashboard viraram a fonte central de consulta.
stats:
  - { value: '100', label: 'linhas na base' }
  - { value: '9', label: 'colunas por colaborador' }
  - { value: '4', label: 'regras de negócio' }
  - { value: '3', label: 'páginas no dashboard' }
---

> Projeto real, feito no estágio de TI na Hebe's Life Science. A simulação acima usa dados fictícios.

## O problema

A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador, qual licença Microsoft ele usa e se a máquina estava pronta para uso.

## Extração e tratamento

Os dados vêm do **Microsoft 365**, a fonte oficial de quem entra na empresa, e viram uma base no Excel com uma linha por colaborador:

- **Nome de usuário**, **e-mail** e **setor**
- **Licença** Microsoft (Standard ou Basic)
- **Nome do PC** e **selo de patrimônio**
- **Antivírus** (Kaspersky) ativo ou não
- **LAPS** aplicado ou não: o script de segurança que bloqueia instalações sem a conta de administrador
- **Versão do Windows** (Pro ou Home)

As colunas de **antivírus** e **LAPS** entraram depois, por decisão da equipe, quando ela passou a acompanhar a segurança dos notebooks. Foram preenchidas **manualmente**, colaborador por colaborador.

Para que todo mundo chegue no mesmo número, defini **4 regras de negócio**, como contar uma vez só o notebook compartilhado. A padronização dos nomes de setor foi feita com ajuda de **IA**, e as regras ficaram comigo. As regras completas estão em [Como eu trabalho](/#habilidades).

## Dashboard

O dashboard começou como uma aba do Excel e foi levado para o **Power BI**, em três páginas: **Licenças**, **Dispositivos** e **Segurança**. Os filtros valem para as três e podem ser combinados, da visão geral até um setor ou um tipo de pendência. LAPS e antivírus têm meta de 100%, e o custo do Kaspersky entra como licenças de 3 anos que vencem juntas, o que ajuda a prever a renovação.

## Resultado

Antes, cada colaborador era consultado um a um no 365 Admin, e o antivírus e o LAPS não ficavam registrados em lugar nenhum. Agora, a base e o dashboard são a **fonte central de consulta**: basta filtrar para achar um colaborador, e os KPIs mostram o que já foi feito e o que ainda falta.

## O que eu automatizaria

O preenchimento manual abre espaço para esquecimentos. O próximo passo seria buscar os dados direto nas ferramentas:

- **Usuários, licenças e LAPS:** a **Microsoft Graph API** devolve os usuários do 365 e os notebooks registrados no **Entra ID**.
- **Antivírus:** o console do **Kaspersky** exporta os dispositivos protegidos, cruzados com a base pelo nome do PC.

Um script agendado juntaria as fontes todos os dias, e o Power BI se atualizaria a partir dela. Só o **selo de patrimônio** continuaria manual, por ser uma etiqueta física.
