import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada arquivo .md em src/content/projetos vira um card na home e uma página de estudo de caso.
const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.string(),
    tools: z.array(z.string()),
    order: z.number().default(99),
    repo: z.string().optional(),
    dashboard: z.string().optional(),
    // Simulação interativa mostrada no topo do estudo de caso
    demo: z.enum(['notebooks']).optional(),
  }),
});

export const collections = { projetos };
