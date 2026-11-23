// O fio que liga o site (estilos no global.css, "O molde das seções").
// A ponta do fio fica a 62% da altura da tela (e desce até o pé dela no fim da página). Conforme a rolagem, o fio
// de cada seção se desenha até onde a ponta chegou: se a pessoa para, ele para; se volta, ele recua. Quando a
// ponta passa pelo título, a seção abre (.aberta); passando por um [data-abre], ele aparece (.aberto); passando
// por um ponto da linha do tempo [data-no], ele acende (.aceso).
// - Fio e caneta (o ponto vermelho na ponta) só em telas largas, com movimento e com a capa na página.
// - No celular, as peças abrem do mesmo jeito, sem o fio.
// - Com movimento reduzido, tudo já aparece (o CSS só esconde com html.fio-js).

type Secao = {
  el: HTMLElement;
  fio: HTMLElement | null;
  titulo: HTMLElement | null;
  sub: HTMLElement | null;
  fim: HTMLElement | null;
  abre: HTMLElement[];
  nos: HTMLElement[];
  m: { topo: number; fim: number; titulo: number; vao: [number, number]; abre: number[]; nos: number[] } | null;
  f: number;
};

const PONTA = 0.62;
const faixa = (v: number, a: number, b: number) => (b <= a ? (v >= b ? 1 : 0) : Math.min(1, Math.max(0, (v - a) / (b - a))));

let parar: (() => void) | undefined;

export function iniciarFio() {
  parar?.();
  const root = document.documentElement;
  const els = [...document.querySelectorAll<HTMLElement>('[data-secao]')];
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('fio-js', 'fio-ligado');
    return;
  }

  const controller = new AbortController();
  const { signal } = controller;
  const temCapa = !!document.querySelector('[data-capa]');
  const largo = matchMedia('(min-width: 56rem)');
  const caneta = document.querySelector<HTMLElement>('[data-fio-caneta]');

  const secoes: Secao[] = els.map((el) => ({
    el,
    fio: el.querySelector('[data-fio]'),
    titulo: el.querySelector('.secao-titulo'),
    sub: el.querySelector('.secao-sub'),
    fim: el.querySelector('[data-fio-fim]'),
    abre: [...el.querySelectorAll<HTMLElement>('[data-abre]')],
    nos: [...el.querySelectorAll<HTMLElement>('[data-no]')],
    m: null,
    f: -1,
  }));

  const capa = document.querySelector<HTMLElement>('[data-capa]');
  let vh = innerHeight, quadro = 0, ligado = false, fimCapa = 0;
  const topo = (e: HTMLElement) => e.getBoundingClientRect().top + scrollY;

  const medir = () => {
    vh = innerHeight;
    ligado = temCapa && largo.matches;
    fimCapa = capa ? topo(capa) + capa.offsetHeight : 0;
    root.classList.toggle('fio-ligado', ligado);
    for (const s of secoes) {
      const t = topo(s.el);
      // o fio termina no fim marcado (o e-mail do contato termina na linha de baixo dele)
      const fim = s.fim ? topo(s.fim) + (s.fim.dataset.fioFim === 'base' ? s.fim.offsetHeight : 0) : t + s.el.offsetHeight;
      // o vão do título (e da frase de apoio), com uma folga de 18 px em cima e embaixo
      const ultimo = s.sub ?? s.titulo;
      const vao: [number, number] = s.titulo && ultimo ? [topo(s.titulo) - 18, topo(ultimo) + ultimo.offsetHeight + 18] : [0, 0];
      if (s.fio) {
        s.fio.style.height = `${Math.max(0, fim - t)}px`;
        s.fio.style.setProperty('--vao-de', `${vao[0] - t}px`);
        s.fio.style.setProperty('--vao-ate', `${vao[1] - t}px`);
      }
      s.m = { topo: t, fim, titulo: s.titulo ? topo(s.titulo) : t, vao, abre: s.abre.map(topo), nos: s.nos.map(topo) };
      s.f = -1;
    }
    pedir();
  };

  const pedir = () => {
    if (!quadro) quadro = requestAnimationFrame(aplicar);
  };

  const aplicar = () => {
    quadro = 0;
    // perto do fim da página, a ponta desce até o pé da tela, para alcançar o que está lá embaixo
    const max = root.scrollHeight - vh;
    const fimK = faixa(scrollY, max - vh * 0.5, max);
    const frac = PONTA + (0.92 - PONTA) * fimK;
    const ponta = scrollY + vh * frac;
    if (caneta) caneta.style.transform = fimK ? `translateY(${((frac - PONTA) * vh).toFixed(1)}px)` : '';
    // a vinheta do fundo aparece enquanto a capa sai da tela (ver global.css)
    root.style.setProperty('--vinheta', capa ? faixa(scrollY, fimCapa - vh, fimCapa - vh * 0.3).toFixed(3) : '1');
    let desenhando = false;
    for (const s of secoes) {
      const m = s.m;
      if (!m) continue;
      if (ligado && s.fio) {
        const f = faixa(ponta, m.topo, m.fim);
        if (f !== s.f) { s.f = f; s.fio.style.setProperty('--resto', `${((1 - f) * 100).toFixed(2)}%`); }
        // a caneta só aparece desenhando, e some enquanto a ponta atravessa o vão do título
        if (f > 0 && f < 1 && !(ponta > m.vao[0] && ponta < m.vao[1])) desenhando = true;
      }
      s.el.classList.toggle('aberta', ponta > m.titulo - 40);
      s.abre.forEach((e, k) => e.classList.toggle('aberto', ponta > m.abre[k] + 20));
      s.nos.forEach((e, k) => e.classList.toggle('aceso', ponta > m.nos[k] + 6));
    }
    caneta?.classList.toggle('is-ligada', ligado && desenhando);
  };

  root.classList.add('fio-js');
  medir();
  // as alturas mudam quando as fontes e as imagens chegam (e quando um princípio abre): mede de novo
  document.fonts?.ready.then(medir);
  const ro = new ResizeObserver(() => medir());
  ro.observe(document.body);
  addEventListener('scroll', pedir, { passive: true, signal });
  addEventListener('resize', medir, { signal });
  largo.addEventListener('change', medir, { signal });

  parar = () => {
    controller.abort();
    ro.disconnect();
    cancelAnimationFrame(quadro);
    root.classList.remove('fio-js', 'fio-ligado');
    root.style.removeProperty('--vinheta');
  };
}
