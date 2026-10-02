const FILE = "/assets/lagu.mp3";
const VOLUME = 0.6;

const audio = new Audio(FILE);
audio.loop = true;
audio.volume = VOLUME;
audio.preload = "auto";
audio.addEventListener("error", () => console.warn("Lagu tidak ditemukan: " + FILE));

let fadeTimer;
function fade(to, ms) {
  clearInterval(fadeTimer);
  const v0 = audio.volume, t0 = Date.now();
  fadeTimer = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / ms);
    audio.volume = v0 + (to - v0) * k;
    if (k === 1) clearInterval(fadeTimer);
  }, 30);
}

function start() {
  if (!audio.paused) return;
  audio.volume = 0;
  audio.play().then(() => fade(VOLUME, 700)).catch(() => {});
}

window.BdayMusic = { start, stop: () => audio.pause(), fade };
