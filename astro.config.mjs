// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gabrielnavarrogermano.vercel.app',
  // Fontes baixadas do Google no build e servidas pelo próprio site: sem pedido a outro domínio,
  // e com fontes de reserva ajustadas para o texto não pular quando a fonte chega.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Tektur',
      cssVariable: '--ff-tektur',
      weights: ['400 900'],
      // O nome da capa usa a Tektur estreita (largura 75%): sem este eixo, ele não cabe na tela
      options: { experimental: { variableAxis: { wdth: [[75, 100]] } } },
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--ff-serif',
      weights: [400],
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--ff-geist',
      weights: ['400 700'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--ff-geist-mono',
      weights: [400, 500],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
