/* Page 5 — Toples kata-kata. Hiasan & efek dasar ikut dari js/page2.js.
   Isi kartunya diambil dari daftar di js/lyrics-data.js, jadi kalau daftarnya diubah, page ini ikut berubah. */
import { mount as base, burst } from "./page2.js";
import { LYRICS } from "./lyrics-data.js";

// hati satu goresan dengan ekor melingkar kecil di ujung bawah
const HEART5 = '<svg viewBox="0 0 200 190"><path pathLength="100" d="M100 160C40 118 10 86 10 56C10 28 32 12 55 12C75 12 92 24 100 40C108 24 125 12 145 12C168 12 190 28 190 56C190 86 160 118 100 160C112 172 132 176 138 164C144 150 122 146 118 158"/></svg>';
const ICONS = ["♥", "✦", "★", "♪", "✿"];

// sekali toplesnya sudah dibuka, kata-katanya tetap tampil saat kembali ke page ini (mis. dari page 6)
let opened = false;

export function mount(root) {
  const off = base(root, HEART5);
  const ac = new AbortController();
  const { signal } = ac;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const jar = root.querySelector("#jar");
  const box = root.querySelector("#notes");
  const hint = root.querySelector("#jarHint");
  const giftWrap = root.querySelector(".gift-wrap");

  // satu kartu per kalimat (teks dimasukkan sebagai teks biasa, bukan HTML)
  LYRICS.map(l => (typeof l === "string" ? l : l && l.text)).filter(Boolean).forEach((q, i) => {
    const n = document.createElement("article");
    n.className = "note t" + (i % 3);
    n.style.setProperty("--i", i);
    const badge = document.createElement("i");
    badge.className = "badge";
    badge.textContent = ICONS[i % ICONS.length];
    const p = document.createElement("p");
    p.textContent = q;
    n.append(badge, p);
    box.appendChild(n);
  });
  const notes = [...box.children];

  // tandai toples sudah dibuka: kartu & kado boleh tampil + petunjuk jadi "tuang lagi"
  function markOpened() {
    opened = true;
    box.classList.add("filled");
    giftWrap.classList.remove("locked");
    hint.textContent = "tap toplesnya kalau mau dituang lagi";
    jar.setAttribute("aria-label", "Toples kata-kata, tap untuk menuang lagi");
  }

  // tutup toples terbuka, lalu semua kartu keluar sekaligus
  function pour() {
    timers.splice(0).forEach(clearTimeout);
    markOpened();
    box.classList.add("reset"); // kartu langsung kembali ke toples tanpa animasi mundur
    notes.forEach(n => n.classList.remove("shown"));
    void box.offsetWidth;
    box.classList.remove("reset");
    jar.classList.add("open");
    later(() => notes.forEach(n => n.classList.add("shown")), 350);
    later(() => jar.classList.remove("open"), 1800);
  }

  if (opened) {
    markOpened();
    box.classList.add("reset");
    notes.forEach(n => n.classList.add("shown"));
    void box.offsetWidth;
    box.classList.remove("reset");
  }

  jar.addEventListener("click", () => {
    const r = jar.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.3);
    jar.classList.remove("shake");
    void jar.offsetWidth;
    jar.classList.add("shake");
    pour();
  }, { signal });

  return () => { off(); ac.abort(); timers.forEach(clearTimeout); };
}
