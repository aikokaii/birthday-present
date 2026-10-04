import { mount as base, burst } from "./page2.js";

const HEART4 = '<svg viewBox="0 0 200 190"><path pathLength="100" d="M18 178C50 192 90 190 100 165C40 120 10 85 10 55C10 28 32 12 55 12C75 12 92 24 100 40C108 24 125 12 145 12C168 12 190 28 190 55C190 85 160 120 100 165C110 190 150 192 182 178"/></svg>';

export function mount(root) {
  const off = base(root, HEART4);
  const ac = new AbortController();
  const { signal } = ac;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const $ = id => root.querySelector("#" + id);

  const flames = [...root.querySelectorAll(".flame")];
  const svg = root.querySelector(".cake svg");
  const texts = { small: $("cakeSmall").textContent, main: $("cakeMain").textContent, hint: $("cakeHint").textContent };
  let done = false;

  function finish() {
    done = true;
    const r = svg.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.35);
    later(() => burst(r.left + r.width * 0.2, r.top + r.height * 0.5), 250);
    later(() => burst(r.left + r.width * 0.8, r.top + r.height * 0.5), 450);
    $("cakeSmall").textContent = "yeay!! 🎉";
    $("cakeMain").textContent = "Semoga semua wish kamu terkabul!!";
    $("cakeHint").textContent = "wish-nya rahasia ya, jangan bilang siapa-siapa 🤫";
    $("blow").classList.add("hide");
    $("relight").classList.remove("hide");
    const wrap = root.querySelector(".gift-wrap");
    wrap.classList.remove("locked");
    later(() => $("gift").scrollIntoView({ behavior: "smooth", block: "center" }), 1100);
  }

  function blow(f) {
    if (f.classList.contains("out")) return;
    f.classList.add("out");
    if (!done && flames.every(x => x.classList.contains("out"))) later(finish, 700);
  }

  const hit = e => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const f = el && el.closest && el.closest(".flame");
    if (f) blow(f);
  };
  svg.addEventListener("pointerdown", hit, { signal });
  svg.addEventListener("pointermove", e => { if (e.buttons) hit(e); }, { signal });

  $("blow").addEventListener("click", () => flames.forEach((f, i) => later(() => blow(f), i * 220)), { signal });

  $("relight").addEventListener("click", () => {
    flames.forEach(f => f.classList.remove("out"));
    done = false;
    $("cakeSmall").textContent = texts.small;
    $("cakeMain").textContent = texts.main;
    $("cakeHint").textContent = texts.hint;
    $("blow").classList.remove("hide");
    $("relight").classList.add("hide");
  }, { signal });

  return () => { off(); ac.abort(); timers.forEach(clearTimeout); };
}