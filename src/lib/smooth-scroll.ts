// Links para uma seção da mesma página (#contato, /#projetos): a página desliza até ela.
// A rolagem em si é a nativa do navegador (a roda do mouse e o trackpad respondem como o usuário espera);
// o deslize vem do scroll-behavior: smooth do global.css, que respeita quem pediu menos movimento.
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
  target.scrollIntoView();
}, true);
