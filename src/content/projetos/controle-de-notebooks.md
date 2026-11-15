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
  - { value: '3', label: 'páginas no dashboard' }
  - { value: '1', label: 'fonte central de consulta' }
---

> Projeto real, feito no estágio de TI na Hebe's Life Science. A simulação acima usa dados fictícios.

## O problema

A equipe de TI precisava saber, de forma rápida, qual notebook estava com cada colaborador, qual licença Microsoft ele usa e se a máquina estava pronta para uso, com todas as dependências instaladas.

## Extração e tratamento

Os dados dos colaboradores vêm do **Microsoft 365**, a fonte oficial de quem entra na empresa, e são organizados em uma base no Excel, com uma linha por colaborador (hoje, **100 linhas**):

- **Nome de usuário** e **e-mail**
- **Setor**
- **Licença** Microsoft (Standard ou Basic)
- **Nome do PC**
- **Antivírus** (Kaspersky) ativo ou não
- **LAPS** aplicado ou não
- **Selo de patrimônio**
- **Versão do Windows** (Pro ou Home)

No começo, a base tinha só os dados do 365. As colunas de **antivírus** e **LAPS** vieram depois, quando a equipe passou a acompanhar a segurança dos notebooks, e foram preenchidas **manualmente**, colaborador por colaborador.

As regras de negócio também foram definidas por mim: um **notebook compartilhado** por mais de um colaborador conta uma vez só (o dispositivo, a licença do antivírus e o LAPS), e os textos da base, como setores e nomes, seguem um padrão de escrita.

O **LAPS** é o script de segurança do gerente de TI: depois dele, qualquer instalação fora das diretrizes pede a conta de administrador, e o notebook passa a ser supervisionado no **Microsoft Entra ID**.

## Dashboard

O dashboard começou como uma aba do Excel e depois foi levado para o **Power BI**, conectado à base e dividido em três páginas:

- **Licenças:** licenças em uso por tipo, gasto de 12 meses com o Microsoft 365 e pendências de cadastro
- **Dispositivos:** notebooks em uso, contas sem notebook e o gasto com notebooks e antivírus
- **Segurança:** % de LAPS e de antivírus (meta de 100%), versão do Windows e os setores com mais pendências

Os **filtros** valem para as três páginas e podem ser combinados, para ir da visão geral até um setor ou um tipo de pendência. O custo do Kaspersky entra como licenças de **3 anos** que vencem juntas, o que ajuda a prever a renovação. Na simulação, as páginas e os filtros funcionam, e os valores são fictícios.

## Resultado

Antes, as informações de cada colaborador eram consultadas uma a uma no 365 Admin, e o antivírus e o LAPS não ficavam em lugar nenhum. Agora, a base e o dashboard são a **fonte central de consulta**: basta filtrar para achar um colaborador, e os KPIs mostram o que já foi feito e o que ainda falta melhorar.

## O que eu automatizaria

O preenchimento manual abre espaço para esquecimentos. O próximo passo seria buscar os dados direto nas ferramentas:

- **Usuários e licenças:** a **Microsoft Graph API** devolve os usuários do 365 com setor e licenças.
- **LAPS e notebooks:** a mesma API mostra os notebooks registrados no **Entra ID** e quais já têm o LAPS.
- **Antivírus:** o console do **Kaspersky** exporta relatórios dos dispositivos protegidos, cruzados com a base pelo nome do PC.

Um script agendado juntaria as três fontes todos os dias, e o Power BI se atualizaria a partir dela. Só o **selo de patrimônio** continuaria manual, por ser uma etiqueta física.
