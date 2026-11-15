// Efeitos ligados à rolagem, iguais no computador e no celular:
// - [data-reveal]: a linha sobe e aparece quando chega na tela; as que chegam juntas entram uma depois da outra.
// - [data-active]: no toque (sem mouse), faz o papel do hover: liga .is-active quando o elemento passa pelo
//   meio da tela (ou, com data-active="view", quando ele está quase todo visível).
// - [data-count]: o número conta de 0 até o valor quando aparece (aceita "84,9%", "100" etc.).
// Quem pediu menos movimento vê tudo direto, sem animação.

let observers: IntersectionObserver[] = [];

const countUp = (el: HTMLElement) => {
  const m = (el.textContent ?? '').trim().match(/^(\D*)(\d+(?:,\d+)?)(.*)$/);
  if (!m) return;
  const [, prefix, num, suffix] = m;
  const decimals = num.split(',')[1]?.length ?? 0;
  const target = parseFloat(num.replace(',', '.'));
  const duration = 1200;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const value = target * (1 - Math.pow(1 - t, 3));
    el.textContent = `${prefix}${value.toFixed(decimals).replace('.', ',')}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

export function initScrollEffects() {
  observers.forEach((o) => o.disconnect());
  observers = [];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced) {
    // Só esconde o que ainda está abaixo da tela: o que já aparece ao abrir a página fica como está
    const reveal = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((e, i) => {
            const el = e.target as HTMLElement;
            el.style.setProperty('--rd', `${i * 0.09}s`);
            el.classList.replace('is-hidden', 'is-in');
            reveal.unobserve(el);
          });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.classList.add('is-hidden');
      reveal.observe(el);
    });

    const counter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          countUp(e.target as HTMLElement);
          counter.unobserve(e.target);
        }
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => counter.observe(el));

    observers.push(reveal, counter);
  }

  if (matchMedia('(hover: none)').matches) {
    const toggle: IntersectionObserverCallback = (entries) =>
      entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting));
    const center = new IntersectionObserver(toggle, { rootMargin: '-40% 0px -40% 0px' });
    const view = new IntersectionObserver(toggle, { threshold: 0.6 });
    document.querySelectorAll<HTMLElement>('[data-active]').forEach((el) =>
      (el.dataset.active === 'view' ? view : center).observe(el),
    );
    observers.push(center, view);
  }
}
