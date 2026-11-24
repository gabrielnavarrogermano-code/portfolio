// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gabrielnavarrogermano.vercel.app',
  // A barra de ferramentas do Astro no rodapé da tela (só no dev) ficava por cima dos controles do site
  devToolbar: { enabled: false },
  // Fontes baixadas do Google no build e servidas pelo próprio site: sem pedido a outro domínio,
  // e com fontes de reserva ajustadas para o texto não pular quando a fonte chega.
  fonts: [
    // A capa: sem serifa geométrica, em negrito e minúsculas, com as letras apertadas
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--ff-grotesk',
      weights: ['500 800'],
      fallbacks: ['sans-serif'],
    },
    // O texto do site inteiro: desenhada pelo Braille Institute para ser lida com facilidade por qualquer pessoa
    {
      provider: fontProviders.google(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--ff-texto',
      weights: ['200 800'],
      styles: ['normal', 'italic'],
      fallbacks: ['sans-serif'],
    },
    // A versão mono dela: só onde há número de verdade (KPIs, fórmulas, os exemplos)
    {
      provider: fontProviders.google(),
      name: 'Atkinson Hyperlegible Mono',
      cssVariable: '--ff-mono',
      weights: ['400 700'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
