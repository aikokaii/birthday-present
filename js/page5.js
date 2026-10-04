import { mount as base, burst } from "./page2.js";

const HEART4 = '<svg viewBox="0 0 300 150"><path pathLength="100" d="M75 130c-45-34-68-60-68-83c0-20 17-32 34-32c15 0 28 9 34 21c6-12 19-21 34-21c17 0 34 12 34 32c0 23-23 49-68 83q75 26 150 0c-45-34-68-60-68-83c0-20 17-32 34-32c15 0 28 9 34 21c6-12 19-21 34-21c17 0 34 12 34 32c0 23-23 49-68 83"/></svg>';

export function mount(root) {
  const off = base(root, HEART4);
  const ac = new AbortController();
  const fin = root.querySelector("#finale");
  const big = fin.querySelector(".big");

  big.innerHTML = big.textContent.trim().split(" ").map((w, k) =>
    `<span class="w">${[...w].map((c, i) => `<span style="--i:${k * 4 + i}">${c}</span>`).join("")}</span>`
  ).join(" ");

  fin.addEventListener("click", e => burst(e.clientX, e.clientY), { signal: ac.signal });

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    burst(innerWidth * 0.25, innerHeight * 0.6);
    setTimeout(() => burst(innerWidth * 0.75, innerHeight * 0.6), 250);
  }, { threshold: 0.7 });
  io.observe(fin);

  return () => { off(); ac.abort(); io.disconnect(); };
}