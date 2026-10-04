import { mount as base } from "./page2.js";

const HEART3 = '<svg viewBox="0 0 200 180"><path pathLength="100" d="M100 44C90 22 70 10 50 12C24 14 8 36 12 62C18 104 70 140 100 168C130 140 182 104 188 62C192 36 176 14 150 12C130 10 110 22 100 44C104 66 130 76 126 96C122 116 92 114 92 98C92 86 108 84 108 96"/></svg>';

export function mount(root) {
  const off = base(root, HEART3);
  const ac = new AbortController();
  const { signal } = ac;

  const track = root.querySelector("#shots");
  const prev = root.querySelector(".car-btn.prev");
  const next = root.querySelector(".car-btn.next");
  const hint = root.querySelector("#swipeHint");
  const dotsBox = root.querySelector("#dots");
  const total = track.children.length;
  dotsBox.innerHTML = "<i></i>".repeat(total);
  const dots = [...dotsBox.children];

  let idx = 0, raf = 0;
  const update = () => {
    idx = Math.min(total - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
    dots.forEach((d, k) => d.classList.toggle("on", k === idx));
    prev.disabled = idx === 0;
    next.disabled = idx === total - 1;
    if (idx > 0) hint.classList.add("gone");
  };
  const go = d => track.scrollTo({ left: (idx + d) * track.clientWidth, behavior: "smooth" });

  track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true, signal });
  prev.addEventListener("click", () => go(-1), { signal });
  next.addEventListener("click", () => go(1), { signal });
  addEventListener("resize", update, { signal });
  update();

  return () => { off(); ac.abort(); cancelAnimationFrame(raf); };
}