# Portfólio · Gabriel Navarro Germano

Portfólio pessoal com foco em **Análise de Dados**, **Business Intelligence** e **extração e tratamento de dados**, em português e em inglês.

Construído com [Astro](https://astro.build) e [Tailwind CSS](https://tailwindcss.com).

| Ambiente | Endereço |
| --- | --- |
| Produção (português) | https://gabrielnavarrogermano.vercel.app |
| Produção (inglês) | https://gabrielnavarrogermano.vercel.app/en/ |
| Local | http://localhost:4321 (`npm run dev`) |

Hospedado na [Vercel](https://vercel.com): todo push na branch `main` é publicado automaticamente em produção.

## Como o site funciona

- **Capa:** o nome em Tektur, a foto recortada em preto e branco no centro e os dois lados, "negócio" e "Dados". No computador, a capa fica presa na tela enquanto a pessoa rola: a foto se desfaz em pó e o pó vira um **fio** no centro da tela. No celular, a capa cabe numa tela só, com a foto de perfil redonda e colorida.
- **O fio:** liga o site inteiro e se desenha preso à rolagem. Em cada seção ele muda de função:
  - **Prazer, Gabriel:** vira a linha do tempo (Origem, Descoberta e Agora), com os pontos acendendo quando o fio chega.
  - **Projetos:** vira a seta que liga o "antes" ao "depois" de cada projeto.
  - **Como eu trabalho:** divide a lista de princípios do exemplo animado de cada um.
  - **Contato:** termina como a linha embaixo do e-mail.
- **Fundo:** o papel muda de tom devagar ao longo da página (neutro na capa, levemente azulado no meio, mais quente no fim), com uma vinheta leve nas bordas depois da capa.
- **Idiomas:** português em `/` e inglês em `/en/`. O seletor PT e EN, ao lado do Menu, leva para a mesma página no outro idioma.

### Paleta e fontes

| Cor | Hex | Papel |
| --- | --- | --- |
| Sunset | `#E7E7E0` | fundo |
| Nebulosity | `#1A1B16` | títulos e texto |
| Neon Navy | `#141937` | o fio, links e o card de exemplo |
| Red Inferno | `#4E0000` | o único destaque: botões, pontos acesos, "Atual" |
| Astronomicon Grey | `#6E7C89` | linhas e detalhes |
| Wild Dove | `#8B8B8B` | detalhes decorativos |

- **Títulos:** Tektur, na largura estreita.
- **Texto:** Atkinson Hyperlegible Next. A versão mono (Atkinson Hyperlegible Mono) aparece só em números e fórmulas.
- **Serifa:** Instrument Serif, só na palavra "negócio" da capa.

As fontes são baixadas no build e servidas pelo próprio site (configuradas em `astro.config.mjs`).

## Estrutura

```text
public/                          # Arquivos servidos como estão: currículo (PDF), favicon e og.png (prévia do link)
src/
├── assets/                      # Imagens otimizadas pelo Astro: a foto da capa e os prints dos projetos
├── components/
│   ├── Nav.astro                # Barra fixa no topo (progresso de leitura, seletor PT/EN) e o menu em tela cheia
│   ├── Hero.astro               # A capa (e o palco onde a foto vira pó no computador)
│   ├── Secao.astro              # O molde de toda seção: título centralizado no eixo e o fio da seção
│   ├── Presentation.astro       # "Prazer, Gabriel": a linha do tempo
│   ├── Projects.astro           # Uma seção por projeto: print, a seta antes → depois e o link do estudo de caso
│   ├── Skills.astro             # "Como eu trabalho": os 4 princípios e o exemplo animado de cada um
│   ├── Contact.astro            # O e-mail (clicar copia) e os outros canais
│   ├── Footer.astro             # Rodapé
│   ├── Letras.astro             # Texto que entra letra por letra (títulos e o nome da capa)
│   ├── EstudoDeCaso.astro       # A página de um estudo de caso, nos dois idiomas
│   └── Notebook*.astro          # Simulação interativa do dashboard, no estudo de caso
├── content/
│   ├── projetos/                # Estudos de caso em português (um arquivo .md = um projeto)
│   └── projetos-en/             # Os mesmos estudos de caso em inglês (mesmo nome de arquivo)
├── content.config.ts            # Campos aceitos no cabeçalho de cada projeto
├── data/site.ts                 # Nome, e-mail, links, ano, nome do PDF e semestre da faculdade
├── i18n.ts                      # Todos os textos do site nos dois idiomas e os endereços de cada página
├── layouts/Layout.astro         # Estrutura base das páginas (fontes, idioma, prévia do link, analytics)
├── lib/
│   ├── po.ts                    # A foto que vira pó e o pó que vira o fio (capa, no computador)
│   ├── fio.ts                   # O fio das seções: desenho preso à rolagem e as aberturas de cada parte
│   ├── reveal.ts                # Hover no toque e números que contam ao aparecer
│   ├── smooth-scroll.ts         # Links que deslizam até a seção
│   ├── notebooks.ts             # Dados fictícios e cálculos da simulação do dashboard
│   └── curriculo.ts             # Detecta se o PDF do currículo existe (os botões só aparecem se existir)
├── pages/
│   ├── index.astro              # Página inicial em português
│   ├── projetos/[id].astro      # Estudos de caso em português (/projetos/<id>/)
│   └── en/
│       ├── index.astro          # Página inicial em inglês (/en/)
│       └── projects/[id].astro  # Estudos de caso em inglês (/en/projects/<id>/)
└── styles/global.css            # Paleta, o molde das seções, o fio, o fundo e o estilo dos estudos de caso
```

## Como rodar localmente

Requer [Node.js](https://nodejs.org) (versão LTS).

```sh
npm install
npm run dev      # abre em http://localhost:4321
npm run build    # gera o site final em ./dist
npm run check    # verifica tipos e erros nos arquivos .astro e .ts (rode antes de publicar)
```

Para abrir no celular pela mesma rede Wi-Fi, rode `npx astro dev --host` e use o endereço "Network" que aparecer no terminal.

> **Windows:** se aparecer o erro *"a execução de scripts foi desabilitada neste sistema"*, rode uma vez no PowerShell (responda **S** se perguntar):
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Alternativa sem mudar nada no sistema: use `npm.cmd` / `npx.cmd` no lugar de `npm` / `npx`.

## Mudar um texto

Os textos do site ficam em `src/i18n.ts`, com o português e o inglês lado a lado. Edite os dois idiomas juntos. Os dados pessoais (e-mail, links, semestre da faculdade) ficam em `src/data/site.ts`.

## Adicionar um projeto

1. Crie o arquivo em português em `src/content/projetos/`. O nome do arquivo vira o endereço (`controle-de-notebooks.md` → `/projetos/controle-de-notebooks/`).
2. Crie a versão em inglês com o **mesmo nome de arquivo** em `src/content/projetos-en/` (→ `/en/projects/controle-de-notebooks/`).

```md
---
title: Nome do projeto
summary: Uma frase sobre o problema resolvido.
before: Como era antes.
after: Como ficou depois.
kind: Extração e Tratamento
tools: [SQL, Excel, Power BI]
order: 2                  # posição na lista (menor aparece primeiro)
context: Estágio de TI · Empresa
cover: ../../assets/projetos/print-1.png        # print mostrado na página inicial
coverHover: ../../assets/projetos/print-2.png   # print que aparece no hover (opcional)
# dashboard: https://...  (opcional: link para o dashboard publicado)
# repo: https://github.com/...  (opcional: link para o código)
---

## O problema

## O que eu entreguei

## Resultado
```

## Contato

[LinkedIn](https://www.linkedin.com/in/gabrielnavarrogermano/) · gabrielnavarrogermano@gmail.com
