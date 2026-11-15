import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada arquivo .md em src/content/projetos vira um card na home e uma página de estudo de caso.
const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z.object({
    title: z.string(),
    summary: z.string(),
    // Tópico "O problema" mostrado na home, abaixo do card do projeto
    problem: z.string(),
    kind: z.string(),
    tools: z.array(z.string()),
    order: z.number().default(99),
    repo: z.string().optional(),
    dashboard: z.string().optional(),
    // Simulação interativa mostrada no topo do estudo de caso
    demo: z.enum(['notebooks']).optional(),
    // Capa do card na home (imagem em src/assets) e a imagem que aparece por cima no hover
    cover: image().optional(),
    coverHover: image().optional(),
    // Ficha do cabeçalho do estudo de caso: onde foi feito e o que foi entregue
    context: z.string().optional(),
    // Resultado em uma frase, mostrado na ficha embaixo do card na home
    result: z.string().optional(),
    deliverable: z.string().optional(),
    // Números em destaque logo depois da simulação (tirados do próprio texto do estudo)
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  }),
});

export const collections = { projetos };
