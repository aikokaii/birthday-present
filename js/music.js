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

let stopTimer;

function start() {
  clearTimeout(stopTimer);
  if (!audio.paused) { fade(VOLUME, 300); return; }
  audio.volume = 0;
  audio.play().then(() => fade(VOLUME, 700)).catch(() => {});
}

function stop() {
  fade(0, 500);
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => { audio.pause(); audio.currentTime = 0; }, 550);
}

function toggle() {
  clearTimeout(stopTimer);
  if (audio.paused) {
    audio.volume = 0;
    audio.play().then(() => fade(VOLUME, 500)).catch(() => {});
  } else {
    audio.pause();
  }
}

function toggleMute() { audio.muted = !audio.muted; }

const ready = new Promise(res => {
  audio.addEventListener("canplaythrough", res, { once: true });
  audio.addEventListener("error", res, { once: true });
  setTimeout(res, 3500);
});

window.BdayMusic = { start, stop, fade, toggle, toggleMute, ready, audio };