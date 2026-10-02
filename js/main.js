import "./music.js";
import css1 from "../css/page1.css?inline";
import css2 from "../css/page2.css?inline";
import css3 from "../css/page3.css?inline";
import css4 from "../css/page4.css?inline";
import html1 from "../pages/page1.html?raw";
import html2 from "../pages/page2.html?raw";
import html3 from "../pages/page3.html?raw";
import html4 from "../pages/page4.html?raw";
import { mount as mount1 } from "./page1.js";
import { mount as mount2 } from "./page2.js";
import { mount as mount3 } from "./page3.js";
import { mount as mount4 } from "./page4.js";

const PAGES = {
  1: { title: "Hari ini hari apa ya? 💙", html: html1, css: [css1], mount: mount1 },
  2: { title: "Happy Birthday Sahara 💙", html: html2, css: [css2], mount: mount2 },
  3: { title: "Our moments together 💙", html: html3, css: [css2, css3], mount: mount3 },
  4: { title: "HAPPY BIRTHDAY SAHARA 💙", html: html4, css: [css2, css4], mount: mount4 },
};

const app = document.getElementById("app");
const wait = ms => new Promise(r => setTimeout(r, ms));
let current = 0, cleanup = null, styles = [], req = 0;

async function show(n) {
  if (n === current) return;
  if (!PAGES[n]) { history.replaceState(null, "", "#/" + current); return; }
  const token = ++req;
  if (current) { app.style.opacity = 0; await wait(500); }
  if (token !== req) return;

  if (cleanup) cleanup();
  styles.forEach(s => s.remove());
  const p = PAGES[n];
  styles = p.css.map(css => {
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    return s;
  });
  app.innerHTML = p.html;
  document.title = p.title;
  scrollTo(0, 0);
  cleanup = p.mount(app);

  if (n > 1) {
    const b = document.createElement("button");
    b.className = "back-btn";
    b.type = "button";
    b.setAttribute("aria-label", "Kembali ke page sebelumnya");
    b.title = "Kembali";
    b.innerHTML = "<span>&lt;</span>";
    b.addEventListener("click", () => { location.hash = "#/" + (n - 1); });
    app.appendChild(b);
  }
  current = n;
  requestAnimationFrame(() => (app.style.opacity = 1));
}

const num = () => Number(location.hash.slice(2)) || 1;
app.style.opacity = 0;
addEventListener("hashchange", () => show(num()));
show(num());

["pointerdown", "keydown", "touchend"].forEach(ev =>
  addEventListener(ev, () => { if (current > 1) BdayMusic.start(); }, { once: true })
);