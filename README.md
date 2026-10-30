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
public/                        # Ícones da aba do navegador (favicon)
src/
├── assets/gabriel.png         # Foto da capa
├── components/
│   ├── Nav.astro              # Menu fixo no topo, com barra de progresso
│   ├── Hero.astro             # Capa: foto, nome e efeito de digitação
│   ├── Presentation.astro     # Apresentação: card gabriel.py, por que dados, formação e estágio
│   ├── Skills.astro           # "Como eu trabalho": as 4 etapas do ETL com exemplo interativo
│   ├── EtlStep.astro          # Uma etapa do ETL (usada dentro de Skills)
│   ├── Projects.astro         # Lista de projetos (cards)
│   ├── NotebookSheet.astro    # Simulação animada da planilha do controle de notebooks
│   ├── Contact.astro          # Contato
│   ├── Footer.astro           # Rodapé
│   └── SectionTitle.astro     # Título padrão das seções
├── content/projetos/          # Estudos de caso em Markdown (um arquivo = um projeto)
├── content.config.ts          # Campos aceitos no cabeçalho de cada projeto
├── data/site.ts               # Nome, e-mail e links de contato
├── layouts/Layout.astro       # Estrutura base de todas as páginas (fontes, animações de entrada)
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

[LinkedIn](https://www.linkedin.com/in/gabriel-navarro-germano/) · gabrielnavarrogermano@gmail.com
