let box = null;

export function initPhotos(app) {
  app.addEventListener("click", e => {
    const fig = e.target.closest(".polaroid");
    const img = fig && fig.querySelector("img");
    if (img) open([...app.querySelectorAll(".polaroid img")], img);
  });
}

function open(imgs, start) {
  if (box) return;
  const many = imgs.length > 1;
  let i = Math.max(0, imgs.indexOf(start));

  const el = (box = document.createElement("div"));
  el.className = "lightbox";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Foto diperbesar");
  el.innerHTML =
    '<button class="lb-close" type="button" aria-label="Tutup">✕</button>' +
    (many ? '<button class="lb-nav prev" type="button" aria-label="Foto sebelumnya">‹</button>' : "") +
    '<figure class="lb-frame"><img alt=""></figure>' +
    (many ? '<button class="lb-nav next" type="button" aria-label="Foto berikutnya">›</button><div class="lb-count"></div>' : "");
  document.body.appendChild(el);

  const img = el.querySelector("img");
  const count = el.querySelector(".lb-count");
  const render = () => {
    img.src = imgs[i].currentSrc || imgs[i].src;
    img.alt = imgs[i].alt;
    if (count) count.textContent = i + 1 + " / " + imgs.length;
  };
  const go = d => { i = (i + d + imgs.length) % imgs.length; render(); };

  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const onKey = e => {
    if (e.key === "Escape") close();
    else if (many && e.key === "ArrowLeft") go(-1);
    else if (many && e.key === "ArrowRight") go(1);
  };
  function close() {
    if (box !== el) return;
    box = null;
    removeEventListener("keydown", onKey);
    removeEventListener("hashchange", close);
    document.body.style.overflow = prevOverflow;
    el.classList.remove("in");
    setTimeout(() => el.remove(), 260);
  }
  addEventListener("keydown", onKey);
  addEventListener("hashchange", close);

  el.addEventListener("click", e => {
    const nav = e.target.closest(".lb-nav");
    if (nav) go(nav.classList.contains("next") ? 1 : -1);
    else close();
  });

  let x0 = 0, y0 = 0;
  el.addEventListener("pointerdown", e => { x0 = e.clientX; y0 = e.clientY; });
  el.addEventListener("pointerup", e => {
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (many && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 2) go(dx < 0 ? 1 : -1);
  });

  render();
  requestAnimationFrame(() => el.classList.add("in"));
  el.querySelector(".lb-close").focus({ preventScroll: true });
}