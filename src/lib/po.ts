// A capa no computador (html.palco-ativo): ela fica presa na tela enquanto a rolagem passa pelo trilho, e nesse
// tempo os textos saem, a foto se desfaz de cima para baixo e o pó viaja em arco até virar o fio no centro da tela,
// que continua nas seções (lib/fio.ts). Voltando a rolagem, tudo se remonta.
// Parada, a foto é a própria <img> do site, intacta: os canvas só aparecem quando algo se solta.
//
// Para ficar leve:
// - a foto é apagada por uma máscara pequena (um ponto por grão), ampliada com suavização sobre a cópia dela;
// - o pó é pintado direto num buffer de pixels e enviado ao canvas uma vez por quadro;
// - nada roda com a capa parada; a rolagem chega amortecida, para o movimento nunca dar tranco.

const PASSO = 4; // um grão a cada 4 px da foto
// Linha do tempo do trilho (0 a 1). O pó some perto do fim (0,96), para o trilho não terminar com a tela parada,
// só com o fio (o trilho, na Hero, tem 190svh)
const T = { textos: 0.18, comeca: 0.056, espalha: 0.27, ruido: 0.056, saida: 0.045, viagem: 0.336, fioDe: 0.56, fioAte: 0.874, poSome: 0.963 };
const TOPO_FIO = 0.58; // o fio da capa vai de 58% da altura da tela até o pé dela

// A cor do fio (--color-fio, no global.css), em RGB
const corDoFio = (): [number, number, number] => {
  const m = getComputedStyle(document.documentElement).getPropertyValue('--color-fio').trim().match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [20, 25, 55];
};

const suave = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const faixa = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const ruido = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Po = {
  cw: number; ch: number;
  dados: ImageData; pixels: Uint32Array; mascaraDados: ImageData; inicio: Float32Array;
  x: Float32Array; y: Float32Array; tx: Float32Array; ty: Float32Array; curva: Float32Array;
  cor: Uint8Array; alfa: Float32Array; cel: Uint32Array; corFio: [number, number, number];
};

export function iniciarPo(capa: HTMLElement, signal: AbortSignal) {
  const root = document.documentElement;
  const trilho = capa;
  const palco = capa.querySelector<HTMLElement>('[data-palco]');
  const retrato = capa.querySelector<HTMLElement>('[data-retrato]');
  const img = retrato?.querySelector<HTMLImageElement>('img');
  const cvFoto = capa.querySelector<HTMLCanvasElement>('[data-po-foto]');
  const cvPo = capa.querySelector<HTMLCanvasElement>('[data-po]');
  const fioCapa = capa.querySelector<HTMLElement>('[data-fio-capa]');
  const somem = [...capa.querySelectorAll<HTMLElement>('[data-capa-some]')];
  if (!palco || !retrato || !img || !cvFoto || !cvPo || !fioCapa) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pb = retrato.hasAttribute('data-po-pb');

  const ctxFoto = cvFoto.getContext('2d')!;
  const ctxPo = cvPo.getContext('2d')!;
  const copia = document.createElement('canvas');
  const mascara = document.createElement('canvas');
  const ctxMascara = mascara.getContext('2d')!;

  let po: Po | null = null;
  let s = 0, sAlvo = 0, desenhado = -1, quadro = 0;

  const mq = matchMedia('(min-width: 56rem)');
  // o palco só existe em telas largas (a Hero já liga a classe antes de pintar; aqui ela acompanha a janela)
  const ativo = () => root.classList.toggle('palco-ativo', mq.matches);

  const limpar = () => {
    retrato.classList.remove('po-ativo');
    for (const el of somem) {
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
    }
    fioCapa.style.removeProperty('transform');
    retrato.style.removeProperty('--arco');
    ctxPo.clearRect(0, 0, cvPo.width, cvPo.height);
  };

  const montar = () => {
    po = null;
    if (!ativo() || !img.complete || !img.naturalWidth) return limpar();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rp = palco.getBoundingClientRect(), rr = retrato.getBoundingClientRect();
    const fw = rr.width, fh = rr.height, cw = Math.round(rp.width), ch = Math.round(rp.height);
    if (!fw || !fh || !cw || !ch) return;
    // o pó em 1 px CSS por pixel: grãos quadrados não precisam de mais, e o buffer fica pequeno
    cvPo.width = cw; cvPo.height = ch;
    const dados = ctxPo.createImageData(cw, ch);
    const ox = rr.left - rp.left, oy = rr.top - rp.top;

    // a cópia da foto nas cores originais: o preto e branco vem do mesmo filtro CSS da <img>
    for (const c of [copia, cvFoto]) { c.width = Math.round(fw * dpr); c.height = Math.round(fh * dpr); }
    const cc = copia.getContext('2d', { willReadFrequently: true })!;
    const esc = Math.min(copia.width / img.naturalWidth, copia.height / img.naturalHeight);
    const iw = img.naturalWidth * esc, ih = img.naturalHeight * esc;
    cc.clearRect(0, 0, copia.width, copia.height);
    cc.drawImage(img, (copia.width - iw) / 2, copia.height - ih, iw, ih);
    const px = cc.getImageData(0, 0, copia.width, copia.height).data, W = copia.width;

    const cols = Math.ceil(fw / PASSO), linhas = Math.ceil(fh / PASSO);
    mascara.width = cols; mascara.height = linhas;
    const inicio = new Float32Array(cols * linhas);
    const g = { x: [] as number[], y: [] as number[], tx: [] as number[], ty: [] as number[], curva: [] as number[], cor: [] as number[], alfa: [] as number[], cel: [] as number[] };
    const cx = cw / 2, topoFio = ch * TOPO_FIO;
    for (let r = 0; r < linhas; r++) {
      for (let c = 0; c < cols; c++) {
        const cel = r * cols + c, v = r / linhas;
        inicio[cel] = T.comeca + v * T.espalha + ruido(cel * 3.7) * T.ruido;
        const x = c * PASSO, y = r * PASSO;
        const p = (Math.floor(y * dpr) * W + Math.floor(x * dpr)) * 4;
        const a0 = px[p + 3] / 255;
        if (a0 < 0.2) continue;
        // a base da moldura some no fundo (10%), como na <img> em telas largas
        const borda = Math.min(1, (1 - v) / 0.1);
        if (borda < 0.05) continue;
        // a cor do ponto: a mesma da foto; com a foto em preto e branco ([data-po-pb]), o cinza dela
        g.x.push(ox + x); g.y.push(oy + y);
        g.tx.push(cx + (ruido(cel * 5.1) - 0.5) * 1.2); // destino: um ponto do fio
        g.ty.push(topoFio + ruido(cel * 7.7) * (ch - topoFio));
        g.curva.push((ruido(cel * 9.1) - 0.5) * 260);
        if (pb) {
          const l = Math.round(0.299 * px[p] + 0.587 * px[p + 1] + 0.114 * px[p + 2]);
          g.cor.push(l, l, l);
        } else g.cor.push(px[p], px[p + 1], px[p + 2]);
        g.alfa.push(a0 * borda); g.cel.push(cel);
      }
    }
    po = {
      cw, ch, dados, pixels: new Uint32Array(dados.data.buffer), mascaraDados: ctxMascara.createImageData(cols, linhas), inicio,
      x: Float32Array.from(g.x), y: Float32Array.from(g.y), tx: Float32Array.from(g.tx), ty: Float32Array.from(g.ty),
      curva: Float32Array.from(g.curva), cor: Uint8Array.from(g.cor), alfa: Float32Array.from(g.alfa), cel: Uint32Array.from(g.cel),
      corFio: corDoFio(), // o pó ganha a cor do fio (Neon Navy) conforme chega nele
    };
    desenhado = -1;
    rolar();
  };

  const rolar = () => {
    if (!ativo()) return;
    const total = trilho.offsetHeight - innerHeight;
    sAlvo = total > 0 ? Math.min(1, Math.max(0, -trilho.getBoundingClientRect().top / total)) : 0;
    if (!quadro) quadro = requestAnimationFrame(desenhar);
  };

  const desenhar = () => {
    quadro = 0;
    s += (sAlvo - s) * 0.18;
    if (Math.abs(sAlvo - s) < 0.0005) s = sAlvo;
    if (s !== desenhado) { desenhado = s; pintar(s); }
    if (s !== sAlvo) quadro = requestAnimationFrame(desenhar);
  };

  const pintar = (s: number) => {
    // os textos da capa saem primeiro
    const t = suave(s / T.textos);
    for (const el of somem) { el.style.opacity = String(1 - t); el.style.transform = t ? `translateY(${-24 * t}px)` : ''; }
    // o fio da capa se desenha enquanto o pó chega nele
    fioCapa.style.transform = `scaleY(${suave(faixa(s, T.fioDe, T.fioAte))})`;
    // o arco atrás da foto some enquanto ela se desfaz
    retrato.style.setProperty('--arco', String(1 - suave(faixa(s, T.comeca, T.comeca + T.espalha + T.saida))));
    if (!po) return;
    const solto = s > T.comeca;
    retrato.classList.toggle('po-ativo', solto);
    if (!solto) { ctxPo.clearRect(0, 0, po.cw, po.ch); return; }

    // 1) a foto se apaga pela máscara
    const m = po.mascaraDados.data, ini = po.inicio;
    for (let i = 0; i < ini.length; i++) m[i * 4 + 3] = 255 * (1 - suave((s - ini[i]) / T.saida));
    ctxMascara.putImageData(po.mascaraDados, 0, 0);
    ctxFoto.globalCompositeOperation = 'copy';
    ctxFoto.drawImage(copia, 0, 0);
    ctxFoto.globalCompositeOperation = 'destination-in';
    ctxFoto.imageSmoothingEnabled = true;
    ctxFoto.drawImage(mascara, 0, 0, cvFoto.width, cvFoto.height);
    ctxFoto.globalCompositeOperation = 'source-over';

    // 2) o pó viaja em arco até o fio, escurecendo até a cor dele; com o fio pronto, o pó some
    const some = 1 - suave(faixa(s, T.fioAte - 0.04, T.poSome));
    po.pixels.fill(0);
    if (some > 0) {
      const d = po.dados.data, cw = po.cw, ch = po.ch;
      for (let i = 0; i < po.x.length; i++) {
        const tt = (s - ini[po.cel[i]]) / T.viagem;
        if (tt <= 0) continue;
        const k = suave(tt), arco = k * (1 - k) * 4;
        const x = Math.round(po.x[i] + (po.tx[i] - po.x[i]) * k + po.curva[i] * arco);
        const y = Math.round(po.y[i] + (po.ty[i] - po.y[i]) * k - 60 * arco);
        const a = Math.round(255 * po.alfa[i] * Math.min(1, tt * 5) * some * (1 - 0.35 * arco));
        if (a < 4) continue;
        const r0 = po.cor[i * 3], g0 = po.cor[i * 3 + 1], b0 = po.cor[i * 3 + 2], [fr, fg, fb] = po.corFio;
        const lado = k > 0.85 ? 1 : 2;
        for (let yy = y; yy < y + lado; yy++) {
          if (yy < 0 || yy >= ch) continue;
          for (let xx = x; xx < x + lado; xx++) {
            if (xx < 0 || xx >= cw) continue;
            const p = (yy * cw + xx) * 4;
            d[p] = r0 + (fr - r0) * k; d[p + 1] = g0 + (fg - g0) * k; d[p + 2] = b0 + (fb - b0) * k; d[p + 3] = a;
          }
        }
      }
    }
    ctxPo.putImageData(po.dados, 0, 0);
  };

  addEventListener('scroll', rolar, { passive: true, signal });
  const ro = new ResizeObserver(() => montar());
  ro.observe(palco);
  mq.addEventListener('change', montar, { signal });
  if (img.complete) montar();
  else img.addEventListener('load', montar, { once: true, signal });

  signal.addEventListener('abort', () => {
    ro.disconnect();
    cancelAnimationFrame(quadro);
    limpar();
    root.classList.remove('palco-ativo');
  });
}
