import { play, buzz } from "./sfx.js";

const TEASE = ["eits, salah wleee 😝", "bukan ituu, coba lagi!", "hehe ga bisa dipencet ya?", "yang bener yang mana hayo 🤭"];
const COLORS =["#ffffff", "#bfe3ff", "#8ccbf7", "#5fb0ee", "#3f95dd"];
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>';
const SHAPES = [HEART, HEART, STAR];
const rand = (a, b) => a + Math.random() * (b - a);

export function mount() {
  const sky = document.getElementById("sky");
  const count = innerWidth < 600 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const size = rand(16, 38);
    el.className = "float";
    el.innerHTML = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    el.style.cssText =
      `left:${rand(2, 96)}%;width:${size}px;height:${size}px;` +
      `color:${COLORS[Math.floor(Math.random() * COLORS.length)]};` +
      `--dur:${rand(16, 28)}s;--delay:-${rand(0, 28)}s;--sway:${rand(3, 5)}s;`;
    sky.appendChild(el);
  }

  const ac = new AbortController();
  const { signal } = ac;
  const start = document.getElementById("startBtn");
  const tease = document.getElementById("tease");
  const title = document.querySelector(".title");
  const hint = document.querySelector(".hint");
  const nopes = [...document.querySelectorAll(".nope")];
  const off = new Map();
  let teased = 0, lastDodge = 0;

  start.addEventListener("click", () => {
    play("chime");
    buzz(20);
    BdayMusic.start();
    location.hash = "#/2";
  }, { once: true, signal });

  function dodge(btn, px, py) {
    const now = performance.now();
    if (now - lastDodge < 250) return;
    lastDodge = now;

    const o = off.get(btn) || { x: 0, y: 0 };
    const r = btn.getBoundingClientRect();
    const baseX = r.left - o.x, baseY = r.top - o.y;
    const avoid = [start, title, tease, hint, ...nopes.filter(b => b !== btn)].map(b => b.getBoundingClientRect());
    const pad = 12;
    let best = null, bestDist = -1;
    for (let i = 0; i < 30; i++) {
      const x = pad + Math.random() * Math.max(0, innerWidth - r.width - pad * 2);
      const y = pad + Math.random() * Math.max(0, innerHeight - r.height - pad * 2);
      if (avoid.some(a => x < a.right + 8 && x + r.width > a.left - 8 && y < a.bottom + 8 && y + r.height > a.top - 8)) continue;
      const dist = Math.hypot(x + r.width / 2 - px, y + r.height / 2 - py);
      if (dist > 160) { best = { x, y }; break; }
      if (dist > bestDist) { best = { x, y }; bestDist = dist; }
    }
    if (!best) return;

    o.x = best.x - baseX;
    o.y = best.y - baseY;
    off.set(btn, o);
    btn.style.translate = `${o.x.toFixed(0)}px ${o.y.toFixed(0)}px`;
    tease.textContent = TEASE[teased++ % TEASE.length];
    play("zip");
    buzz(12);
  }

  const center = btn => {
    const r = btn.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };
  for (const btn of nopes) {
    btn.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") dodge(btn, e.clientX, e.clientY); }, { signal });
    btn.addEventListener("pointerdown", e => dodge(btn, e.clientX, e.clientY), { signal });
    btn.addEventListener("click", e => dodge(btn, ...(e.detail ? [e.clientX, e.clientY] : center(btn))), { signal });
  }
  addEventListener("resize", () => {
    off.clear();
    nopes.forEach(b => (b.style.translate = ""));
  }, { signal });

  return () => ac.abort();
}