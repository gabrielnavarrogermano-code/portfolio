# Portfólio · Gabriel Navarro Germano

Portfólio pessoal com foco em **Análise de Dados**, **Business Intelligence** e **soluções ETL**.

Construído com [Astro](https://astro.build) e [Tailwind CSS](https://tailwindcss.com).

| Ambiente | Endereço |
| --- | --- |
| Produção | https://gabrielnavarrogermano.vercel.app |
| Local | http://localhost:4321 (`npm run dev`) |

Hospedado na [Vercel](https://vercel.com): todo push na branch `main` é publicado automaticamente em produção.

## Estrutura

```text
src/
├── components/        # Seções da página (Hero, Apresentação, Projetos, BI...)
├── content/projetos/  # Estudos de caso em Markdown (um arquivo = um projeto)
├── data/site.ts       # Nome, e-mail e links de contato
├── layouts/           # Layout base
├── pages/             # Página inicial e páginas dos projetos
└── styles/global.css  # Paleta de cores e animações
```

## Como rodar localmente

Requer [Node.js](https://nodejs.org) (versão LTS).

```sh
npm install
npm run dev      # abre em http://localhost:4321
npm run build    # gera o site final em ./dist
```

> **Windows:** se aparecer o erro *"a execução de scripts foi desabilitada neste sistema"*, rode uma vez no PowerShell (responda **S** se perguntar):
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Alternativa sem mudar nada no sistema: use `npm.cmd` / `npx.cmd` no lugar de `npm` / `npx`.

## Adicionar um projeto

Crie um arquivo `.md` em `src/content/projetos/` com o cabeçalho:

```md
---
title: Nome do projeto
summary: Uma frase sobre o problema resolvido.
kind: Dashboard
tools: [SQL, Tableau]
order: 1
---
```

## Contato

[LinkedIn](https://www.linkedin.com/in/gabriel-navarro-germano/) · gabrielnavarrogermano@gmail.com
