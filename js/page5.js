import { mount as base, burst } from "./page2.js";
import { QUOTES } from "./quotes-data.js";
import { play, buzz } from "./sfx.js";

const HEART5 = '<svg viewBox="0 0 200 190"><path pathLength="100" d="M100 160C40 118 10 86 10 56C10 28 32 12 55 12C75 12 92 24 100 40C108 24 125 12 145 12C168 12 190 28 190 56C190 86 160 118 100 160C112 172 132 176 138 164C144 150 122 146 118 158"/></svg>';
const ICONS = ["♥", "✦", "★", "♪", "✿"];
const HITS = 3;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const rnd = (i, k) => {
  let t = (i * 374761393 + k * 668265263) >>> 0;
  t = Math.imul(t ^ (t >>> 13), 1274126177);
  t = Math.imul(t ^ (t >>> 16), 2246822507);
  return ((t ^ (t >>> 13)) >>> 0) / 4294967296;
};

let popped = false;

export function mount(root) {
  const off = base(root, HEART5);
  const ac = new AbortController();
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const stage = root.querySelector("#stage");
  const balloon = root.querySelector("#balloon");
  const photo = root.querySelector("#photo");
  const box = root.querySelector("#notes");
  const hint = root.querySelector("#balloonHint");
  const giftWrap = root.querySelector(".gift-wrap");
  let hits = 0;

  QUOTES.forEach((q, i) => {
    const n = document.createElement("article");
    n.className = "note t" + (i % 3);
    const side = i % 2 ? 1 : -1;
    const set = (k, v) => n.style.setProperty(k, v);
    set("--r", rnd(i, 1).toFixed(3));
    set("--f", (side * (0.3 + rnd(i, 2) * 0.7)).toFixed(3));
    set("--rot", ((rnd(i, 3) < 0.5 ? -1 : 1) * (1.5 + rnd(i, 4) * 3.5)).toFixed(1) + "deg");
    set("--dy", Math.round(rnd(i, 5) * 36) + "px");
    const badge = document.createElement("i");
    badge.className = "badge";
    badge.textContent = ICONS[i % ICONS.length];
    const p = document.createElement("p");
    p.textContent = q;
    n.append(badge, p);
    box.appendChild(n);
  });
  const notes = [...box.children];

  function show() {
    popped = true;
    stage.classList.add("popped");
    box.classList.add("filled");
    giftWrap.classList.remove("locked");
    balloon.disabled = true;
    hint.textContent = "yeay pecah!! isinya buat kamu semua 💙";
  }

  function fly(el, x, y, delay, duration, spin) {
    const r = el.getBoundingClientRect();
    const dx = x - r.left - r.width / 2, dy = y - r.top - r.height / 2;
    el.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(${spin}deg)`, opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: "none", opacity: 1 },
    ], { duration, delay, easing: "cubic-bezier(.2, 1.2, .4, 1)", fill: "backwards" });
  }

  function shreds(x, y) {
    const s = stage.getBoundingClientRect();
    const add = (cls, css = "") => {
      const el = document.createElement("i");
      el.className = cls;
      el.style.cssText = `left:${x - s.left}px;top:${y - s.top}px;` + css;
      stage.appendChild(el);
      later(() => el.remove(), 1000);
    };
    add("ring");
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + Math.random() * 0.4, d = 70 + Math.random() * 80;
      add("shred", `--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d).toFixed(0)}px;--r:${(Math.random() * 540 - 270).toFixed(0)}deg`);
    }
  }

  function pop() {
    const b = balloon.querySelector(".bbody").getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2;
    balloon.classList.add("burst");
    burst(x, y);
    play("pop");
    buzz([30, 40, 70]);
    show();
    if (!reduce) {
      shreds(x, y);
      fly(photo, x, y, 60, 1000, -30);
      notes.forEach((n, i) => fly(n, x, y, 320 + i * 80, 850, Math.round(rnd(i, 8) * 80 - 40)));
    }
    later(() => balloon.classList.add("gone"), 900);
  }

  if (popped) {
    balloon.classList.add("gone");
    show();
  } else {
    hint.textContent = `tap balonnya ${HITS} kali biar pecah!`;
  }

  balloon.addEventListener("click", () => {
    if (popped) return;
    hits++;
    balloon.dataset.hits = hits;
    balloon.classList.remove("hit");
    void balloon.offsetWidth;
    balloon.classList.add("hit");
    if (hits >= HITS) return pop();
    play("squeak");
    buzz(12);
    const left = HITS - hits;
    hint.textContent = left === 1 ? "1 kali lagi... siap-siap ya!" : `${left} kali lagi!!`;
    balloon.setAttribute("aria-label", `Balon kata-kata, tap ${left} kali lagi untuk memecahkan`);
  }, { signal: ac.signal });

  return () => { off(); ac.abort(); timers.forEach(clearTimeout); };
}
