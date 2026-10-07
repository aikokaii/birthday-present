import { mount as base, burst } from "./page2.js";
import { play, buzz } from "./sfx.js";

const HEART4 = '<svg viewBox="0 0 300 150"><path pathLength="100" d="M75 130c-45-34-68-60-68-83c0-20 17-32 34-32c15 0 28 9 34 21c6-12 19-21 34-21c17 0 34 12 34 32c0 23-23 49-68 83q75 26 150 0c-45-34-68-60-68-83c0-20 17-32 34-32c15 0 28 9 34 21c6-12 19-21 34-21c17 0 34 12 34 32c0 23-23 49-68 83"/></svg>';

const PAID = "jangan lupa ditagih ya hehe 🍦";
let scratched = false;

function scratchCard(root, signal) {
  const cv = root.querySelector("#scratch");
  const hint = root.querySelector("#scratchHint");
  if (!cv) return;
  if (scratched) {
    cv.classList.add("done");
    cv.tabIndex = -1;
    hint.textContent = PAID;
    return;
  }

  const c = cv.getContext("2d", { willReadFrequently: true });
  let w = 0, h = 0, touched = false, down = false, last = null, checkedAt = 0;

  function paint() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalCompositeOperation = "source-over";

    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#a9d8fc");
    g.addColorStop(0.5, "#6ab8f1");
    g.addColorStop(1, "#3f95dd");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "rgba(255, 255, 255, .28)";
    c.font = "15px Fredoka, sans-serif";
    for (let y = 16, row = 0; y < h; y += 28, row++)
      for (let x = row % 2 ? 30 : 12, k = 0; x < w; x += 36, k++) c.fillText((k + row) % 3 ? "♥" : "✦", x, y);

    const label = "gosok di sini ✦";
    c.font = `600 ${Math.round(Math.min(26, w / 13))}px Fredoka, sans-serif`;
    c.lineWidth = 6;
    c.lineJoin = "round";
    c.strokeStyle = "rgba(37, 88, 143, .45)";
    c.strokeText(label, w / 2, h / 2);
    c.fillStyle = "#fff";
    c.fillText(label, w / 2, h / 2);

    c.globalCompositeOperation = "destination-out";
    c.lineCap = "round";
    c.lineWidth = Math.max(26, w * 0.09);
  }

  function reveal() {
    if (scratched) return;
    scratched = true;
    cv.classList.add("done");
    cv.tabIndex = -1;
    hint.textContent = "yeay! " + PAID;
    const r = cv.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
    play("chime");
    buzz([20, 40, 20, 40, 60]);
  }

  function cleared() {
    const d = c.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 23, total++) if (d[i] < 128) clear++;
    return clear / total;
  }

  function check(force) {
    const now = performance.now();
    if (!force && now - checkedAt < 250) return;
    checkedAt = now;
    const p = cleared();
    if (p > 0.55) reveal();
    else if (p > 0.2) hint.textContent = "dikit lagi...";
  }

  const at = e => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * (w / r.width), (e.clientY - r.top) * (h / r.height)];
  };
  const line = (a, b) => {
    c.beginPath();
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
    c.stroke();
  };

  cv.addEventListener("pointerdown", e => {
    down = touched = true;
    cv.setPointerCapture(e.pointerId);
    last = at(e);
    line(last, [last[0] + 0.1, last[1]]);
  }, { signal });
  cv.addEventListener("pointermove", e => {
    if (!down) return;
    const p = at(e);
    line(last, p);
    last = p;
    check();
  }, { signal });
  const up = () => { if (down) { down = false; check(true); } };
  cv.addEventListener("pointerup", up, { signal });
  cv.addEventListener("pointercancel", up, { signal });
  cv.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); }
  }, { signal });
  addEventListener("resize", () => { if (!touched) paint(); }, { signal });

  paint();
  if (document.fonts && !document.fonts.check("600 20px Fredoka"))
    document.fonts.load("600 20px Fredoka").then(() => { if (!touched && !signal.aborted) paint(); }, () => {});
}

export function mount(root) {
  const off = base(root, HEART4);
  const ac = new AbortController();
  const fin = root.querySelector("#finale");
  const big = fin.querySelector(".big");

  big.innerHTML = big.textContent.trim().split(" ").map((w, k) =>
    `<span class="w">${[...w].map((c, i) => `<span style="--i:${k * 4 + i}">${c}</span>`).join("")}</span>`
  ).join(" ");

  fin.addEventListener("click", e => burst(e.clientX, e.clientY), { signal: ac.signal });
  scratchCard(root, ac.signal);

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    burst(innerWidth * 0.25, innerHeight * 0.6);
    setTimeout(() => burst(innerWidth * 0.75, innerHeight * 0.6), 250);
  }, { threshold: 0.7 });
  io.observe(fin);

  return () => { off(); ac.abort(); io.disconnect(); };
}
