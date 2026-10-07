import { QUOTES, QUOTE_SECONDS } from "./quotes-data.js";

if (QUOTES.length) {
  const audio = window.BdayMusic.audio;
  const box = document.createElement("div");
  const span = document.createElement("span");
  box.className = "quote-pill";
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

  const update = () =>
    set(audio.paused ? "" : QUOTES[Math.floor(audio.currentTime / QUOTE_SECONDS) % QUOTES.length]);
  audio.addEventListener("timeupdate", update);
  audio.addEventListener("pause", update);
}
