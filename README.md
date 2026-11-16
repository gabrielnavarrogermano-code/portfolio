# Portfólio · Gabriel Navarro Germano

Portfólio pessoal com foco em **Análise de Dados**, **Business Intelligence** e **extração e tratamento de dados**.

Construído com [Astro](https://astro.build) e [Tailwind CSS](https://tailwindcss.com).

| Ambiente | Endereço |
| --- | --- |
| Produção | https://gabrielnavarrogermano.vercel.app |
| Local | http://localhost:4321 (`npm run dev`) |

Hospedado na [Vercel](https://vercel.com): todo push na branch `main` é publicado automaticamente em produção.

## Estrutura

```text
public/                        # Arquivos servidos como estão: currículo (PDF), favicon e og.png (prévia do link)
src/
├── assets/                    # Imagens otimizadas pelo Astro: foto da capa e capas dos projetos
├── components/
│   ├── Nav.astro              # Barra fixa no topo, com barra de progresso, e o menu em tela cheia
│   ├── Hero.astro             # Capa: abertura animada (primeira visita), frase, foto, botões e o nome gigante
│   ├── Presentation.astro     # "Prazer, Gabriel": história em capítulos, citação e trajetória (formação e estágio)
│   ├── Projects.astro         # Lista de projetos (cards com imagem, ficha e link do estudo de caso)
│   ├── Skills.astro           # "Como eu trabalho": princípios e o que estou estudando
│   ├── Principles.astro       # Os 4 princípios, com demonstrações animadas (usado em Skills)
│   ├── Contact.astro          # Canais de contato, em linhas
│   ├── Footer.astro           # Rodapé
│   ├── SectionTitle.astro     # Título padrão das seções (entra subindo ao rolar)
│   ├── BgWord.astro           # Palavra gigante em contorno no fundo de uma seção
│   └── Notebook*.astro        # Simulação interativa do dashboard, na página do estudo de caso
├── content/projetos/          # Estudos de caso em Markdown (um arquivo = um projeto)
├── content.config.ts          # Campos aceitos no cabeçalho de cada projeto
├── data/site.ts               # Nome, e-mail, links, ano, nome do PDF e semestre da faculdade
├── layouts/Layout.astro       # Estrutura base de todas as páginas (fontes, analytics, letras girando no hover)
├── lib/
│   ├── reveal.ts              # Efeitos da rolagem: linhas que entram, hover no toque e números que contam
│   ├── smooth-scroll.ts       # Rolagem suave (Lenis) e links que deslizam até a seção
│   ├── notebooks.ts           # Dados fictícios e cálculos da simulação do dashboard
│   └── curriculo.ts           # Detecta se o PDF do currículo existe (os botões só aparecem se existir)
├── pages/
│   ├── index.astro            # Página inicial (ordem das seções)
│   └── projetos/[id].astro    # Página de cada projeto
└── styles/global.css          # Paleta de cores, animações e estilo dos estudos de caso
```

## Como rodar localmente

Requer [Node.js](https://nodejs.org) (versão LTS).

```sh
npm install
npm run dev      # abre em http://localhost:4321
npm run build    # gera o site final em ./dist
npm run check    # verifica tipos e erros nos arquivos .astro e .ts (rode antes de publicar)
```

> **Windows:** se aparecer o erro *"a execução de scripts foi desabilitada neste sistema"*, rode uma vez no PowerShell (responda **S** se perguntar):
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Alternativa sem mudar nada no sistema: use `npm.cmd` / `npx.cmd` no lugar de `npm` / `npx`.

## Adicionar um projeto

Crie um arquivo `.md` em `src/content/projetos/`. O nome do arquivo vira o endereço da página (`controle-de-notebooks.md` → `/projetos/controle-de-notebooks/`).

```md
---
title: Nome do projeto
summary: Uma frase sobre o problema resolvido.
kind: Dashboard
tools: [SQL, Excel]
order: 2                # posição na lista (menor aparece primeiro)
# dashboard: https://...  (opcional: link para o dashboard publicado)
# repo: https://github.com/...  (opcional: link para o código)
---

## O problema

## Os dados

## A solução

## Resultado
```

## Contato

[LinkedIn](https://www.linkedin.com/in/gabrielnavarrogermano/) · gabrielnavarrogermano@gmail.com
