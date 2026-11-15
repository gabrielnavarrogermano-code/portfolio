// Rolagem suave (Lenis): a página desliza em vez de pular a cada giro da roda do mouse.
// - Criada uma vez só: com o ClientRouter, a janela é a mesma entre as páginas.
// - Fica parada enquanto a tela de carregamento ou o menu estão abertos.
// - No toque (celular) a rolagem continua a nativa; quem pediu menos movimento não recebe a suavização.
// - Links para uma seção da mesma página (#contato, /#projetos) deslizam até ela.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

const locked = () => {
  const c = document.documentElement.classList;
  return c.contains('show-loader') || c.contains('menu-open');
};

if (!window.lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    autoRaf: true,
    duration: 1.15,
    allowNestedScroll: true, // tabelas e áreas com rolagem própria continuam rolando por dentro
    virtualScroll: () => !locked(),
  });
  window.lenis = lenis;

  // Depois de trocar de página, a altura muda: o Lenis precisa medir de novo.
  // A troca também copia os atributos do <html> da página nova, apagando a classe que o Lenis pôs lá.
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.classList.add('lenis');
    lenis.resize();
  });
}

// Clique em link para uma seção desta mesma página: desliza até ela (com ou sem Lenis).
// Na fase de captura, para agir antes do ClientRouter (que ignora cliques já tratados).
document.addEventListener('click', (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link) return;
  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  e.preventDefault();
  history.pushState(null, '', url.hash);
  if (window.lenis) window.lenis.scrollTo(target, { offset: 0 });
  else target.scrollIntoView({ behavior: 'smooth' });
}, true);
