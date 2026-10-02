const COLORS = ["#ffffff", "#bfe3ff", "#8ccbf7", "#5fb0ee", "#3f95dd"];
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

  document.getElementById("startBtn").addEventListener("click", () => {
    BdayMusic.start(); // dari klik langsung, jadi tidak diblokir browser
    location.hash = "#/2";
  }, { once: true });

  return () => {};
}
