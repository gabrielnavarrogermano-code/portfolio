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

## Por dentro

Para quem avalia a parte técnica: como a base está organizada, como os dados são tratados e como os indicadores são calculados.

### A base

Uma tabela, com uma linha por registro: uma pessoa, uma conta administradora, um dispositivo compartilhado ou uma máquina sem usuário.

- **Nome**, **e-mail**, **setor** e **função**
- **Licenças** Microsoft 365 e Adobe
- **Nome do PC** e **selo de patrimônio**
- **Antivírus** (Kaspersky) e **LAPS**
- **Versão do Windows**
- **Motivo** de quem não tem equipamento da empresa

### O tratamento, no Power Query

Antes de virar indicador, cada linha é limpa e classificada:

1. **Tipo de conta:** pela função e pelo nome, a linha vira usuário, conta administradora, dispositivo compartilhado ou máquina sem usuário.
2. **Licença:** a mesma conta pode ter várias licenças. A classificação segue uma ordem de prioridade (sem licença, Basic, Standard), e as licenças gratuitas ficam de fora, porque não mudam nenhuma decisão.
3. **Equipamento:** sem nome de PC, o motivo informado diz se a pessoa usa um computador particular, se não tem computador ou se o motivo não foi informado.
4. **Pendências de segurança:** sem LAPS, sem antivírus ou Windows 11 HOME, que precisa virar PRO para usar o LAPS.

### Regras de contagem

1. Uma conta conta uma vez só, pelo e-mail: o mesmo e-mail em duas linhas é uma conta.
2. Um equipamento conta uma vez só, pelo nome do PC: um computador usado por duas pessoas é um equipamento.
3. Não ter equipamento é informação, não pendência: não soma nos indicadores de problema.
4. A cobertura de LAPS é calculada sobre todos os equipamentos, inclusive os Windows HOME, de propósito: eles também precisam do LAPS.

### Medidas

As regras 1 e 2 estão nas próprias medidas, que contam valores distintos, e não linhas. Simplificadas para leitura:

```
Contas Ativas =
CALCULATE (
    DISTINCTCOUNT ( usuarios_office365[E-MAIL] ),
    usuarios_office365[Conta Ativa] = "Sim"
)

Computadores = DISTINCTCOUNTNOBLANK ( usuarios_office365[NOME PC] )

% LAPS =
DIVIDE (
    CALCULATE ( [Computadores], usuarios_office365[Status LAPS] = "Com LAPS" ),
    [Computadores]
)

Custo Licenças (ano) =
    [Contas Standard] * [Preço M365 Standard]
        + [Contas Basic] * [Preço M365 Basic]
        + [Contas Adobe] * [Preço Adobe Acrobat Pro]
        + [Computadores com Antivírus] * [Valor Custo Antivírus] / [Anos Licença Antivírus]
```

O antivírus é pago a cada três anos, por isso entra no custo anual dividido por 3. O preço dele é um parâmetro: na aba Custos, um filtro simula outros valores e todo o custo é recalculado.

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
