// O fio que liga o site (estilos no global.css, "O molde das seções").
// A ponta do fio fica a 62% da altura da tela. Conforme a rolagem, cada segmento se desenha até onde a ponta chegou:
// se a pessoa para, ele para; se volta, ele recua. Quando a ponta passa pela linha de eixo de uma seção, a seção se
// abre (aberto-eixo: linha e título); quando passa pelo começo dos lados, os lados aparecem (aberto-lados).
// - Fio e caneta (o ponto vermelho na ponta) só no computador, com movimento e com a capa na página (html.fio-ligado).
// - No celular, as seções abrem do mesmo jeito, sem o fio.
// - Com movimento reduzido, tudo já aparece aberto (o CSS só esconde com html.fio-js).

type Secao = {
  el: HTMLElement;
  a: HTMLElement | null;
  b: HTMLElement | null;
  eixo: HTMLElement;
  lados: HTMLElement | null;
  topo: number;
  yEixo: number;
  yLados: number;
  fim: number;
  abertoEixo: boolean;
  abertoLados: boolean;
  fa: number;
  fb: number;
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
    a: el.querySelector('[data-fio-a]'),
    b: el.querySelector('[data-fio-b]'),
    eixo: el.querySelector<HTMLElement>('[data-eixo]') ?? el,
    lados: el.querySelector('[data-lados]'),
    topo: 0, yEixo: 0, yLados: 0, fim: 0,
    abertoEixo: false, abertoLados: false, fa: -1, fb: -1,
  }));

  let vh = innerHeight, inicio = 0, fimFio = 0, quadro = 0, ligado = false;

  const medir = () => {
    vh = innerHeight;
    ligado = temCapa && largo.matches;
    root.classList.toggle('fio-ligado', ligado);
    for (const s of secoes) {
      const r = s.el.getBoundingClientRect();
      s.topo = r.top + scrollY;
      s.fim = r.bottom + scrollY;
      s.yEixo = s.eixo.getBoundingClientRect().top + scrollY;
      s.yLados = s.lados ? s.lados.getBoundingClientRect().top + scrollY : s.fim;
      if (s.a) Object.assign(s.a.style, { top: '0px', height: `${Math.max(0, s.yEixo - s.topo)}px` });
      if (s.b) Object.assign(s.b.style, { top: `${s.yLados - s.topo - 20}px`, height: `${Math.max(0, s.fim - s.yLados + 20)}px` });
      s.fa = s.fb = -1;
    }
    inicio = secoes[0].topo;
    fimFio = secoes[secoes.length - 1].yEixo;
    pedir();
  };

  const pedir = () => {
    if (!quadro) quadro = requestAnimationFrame(aplicar);
  };

  const aplicar = () => {
    quadro = 0;
    // perto do fim da página, a ponta desce até o pé da tela, para o fio alcançar o rodapé
    const max = document.documentElement.scrollHeight - vh;
    const fimK = faixa(scrollY, max - vh * 0.6, max);
    const frac = PONTA + (0.96 - PONTA) * fimK;
    const ponta = scrollY + vh * frac;
    if (caneta) caneta.style.transform = fimK ? `translateY(${((frac - PONTA) * vh).toFixed(1)}px)` : '';
    let desenhando = ligado && ponta > inicio && ponta < fimFio;
    for (const s of secoes) {
      if (ligado) {
        const fa = faixa(ponta, s.topo, s.yEixo);
        if (s.a && fa !== s.fa) { s.fa = fa; s.a.style.transform = `scaleY(${fa})`; }
        const fb = faixa(ponta, s.yLados - 20, s.fim);
        if (s.b && fb !== s.fb) { s.fb = fb; s.b.style.transform = `scaleY(${fb})`; }
        if (ponta > s.yEixo + 10 && ponta < s.yLados - 20) desenhando = false; // atrás do título, a caneta some
      }
      // com folga para voltar sem piscar
      const eixo = s.abertoEixo ? ponta > s.yEixo - 60 : ponta > s.yEixo;
      const lados = s.abertoLados ? ponta > s.yLados - 60 : ponta > s.yLados + 30;
      if (eixo !== s.abertoEixo) { s.abertoEixo = eixo; s.el.classList.toggle('aberto-eixo', eixo); }
      if (lados !== s.abertoLados) { s.abertoLados = lados; s.el.classList.toggle('aberto-lados', lados); }
    }
    caneta?.classList.toggle('is-ligada', desenhando);
  };

  root.classList.add('fio-js');
  medir();
  // as alturas mudam quando as fontes e as imagens chegam: mede de novo
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
  };
}
