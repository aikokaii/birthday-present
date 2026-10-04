import { LYRICS, LINE_SECONDS, LRC, OFFSET } from "./lyrics-data.js";

export function parseLRC(src = "") {
  const out = [];
  for (const raw of src.split(/\r?\n/)) {
    const stamps = [...raw.matchAll(/\[(\d+):(\d+(?:[.:]\d+)?)\]/g)];
    if (!stamps.length) continue; // lewati baris info seperti [ar:...]
    const text = raw.replace(/\[[^\]]*\]/g, "").trim();
    for (const m of stamps) out.push({ t: Number(m[1]) * 60 + parseFloat(m[2].replace(":", ".")), text });
  }
  return out;
}

const lrc = parseLRC(LRC);
const items = (lrc.length ? lrc : LYRICS.map(l => (typeof l === "string" ? { text: l } : l)))
  .filter(l => l && typeof l.text === "string");

export function pick(time, list = items, every = LINE_SECONDS) {
  if (!list.length) return "";
  if (list.every(l => typeof l.t === "number")) {
    let text = "";
    for (const l of [...list].sort((a, b) => a.t - b.t)) if (l.t <= time) text = l.text;
    return text;
  }
  return list[Math.floor(time / every) % list.length].text;
}

if (items.length) {
  const box = document.createElement("div");
  const span = document.createElement("span");
  box.className = "lyric";
  box.setAttribute("aria-hidden", "true");
  box.appendChild(span);
  document.body.appendChild(box);

  let shown = "", swap;
  const set = text => {
    if (text === shown) return;
    shown = text;
    clearTimeout(swap);
    box.classList.remove("show");
    if (!text) return;
    swap = setTimeout(() => { span.textContent = text; box.classList.add("show"); }, 400);
  };

  setInterval(() => {
    const a = window.BdayMusic && window.BdayMusic.audio;
    set(!a || a.paused ? "" : pick(a.currentTime - (OFFSET || 0)));
  }, 250);
}