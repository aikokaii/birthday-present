const ICON = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  vol: '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
const SONG = "Can't Help Falling in Love · Elvis Presley";

const box = document.createElement("div");
box.className = "music-ctl";
box.innerHTML =
  '<button class="np" type="button" aria-expanded="false"><i class="np-disc"></i>' +
  `<span class="np-text"><span class="np-track"><span>${SONG}</span><span aria-hidden="true">${SONG}</span></span></span></button>` +
  '<button class="mbtn" type="button"></button><button class="mbtn" type="button"></button>';
document.body.appendChild(box);

const [np, play, mute] = box.children;
const audio = window.BdayMusic.audio;
np.title = SONG;
np.setAttribute("aria-label", "Lagu yang diputar: " + SONG);

let npTimer;
function showSong(on) {
  clearTimeout(npTimer);
  np.classList.toggle("open", on);
  np.setAttribute("aria-expanded", on);
  if (on) npTimer = setTimeout(() => showSong(false), 7000);
}

function sync() {
  const paused = audio.paused, muted = audio.muted;
  np.classList.toggle("playing", !paused);
  play.innerHTML = paused ? ICON.play : ICON.pause;
  play.classList.toggle("off", paused);
  play.title = play.ariaLabel = paused ? "Putar musik" : "Jeda musik";
  mute.innerHTML = muted ? ICON.mute : ICON.vol;
  mute.classList.toggle("off", muted);
  mute.title = mute.ariaLabel = muted ? "Nyalakan suara" : "Matikan suara";
}

["play", "pause", "volumechange"].forEach(ev => audio.addEventListener(ev, sync));
audio.addEventListener("play", () => showSong(true));
np.addEventListener("click", () => showSong(!np.classList.contains("open")));
play.addEventListener("click", () => BdayMusic.toggle());
mute.addEventListener("click", () => BdayMusic.toggleMute());
sync();