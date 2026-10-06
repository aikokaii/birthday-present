/* Daftar kalimat ini dipakai dua tempat: teks yang tampil di bawah layar saat lagu bunyi
   (berganti otomatis tiap LINE_SECONDS detik), dan kartu-kartu di page 5 (toples kata-kata).
   Mau tambah, hapus, atau ganti kalimat? Edit saja daftar di bawah (satu kalimat per baris,
   diapit tanda kutip dan diakhiri koma). Kalau dikosongkan, tidak ada yang tampil. */

export const LINE_SECONDS = 8; // lama tiap kalimat tampil (detik)

export const LYRICS = [
  "Somehow, you always seem to make a moment more memorable just by being in it.",
  "Some people are beautiful to look at. You’re beautiful to remember.",
  "You’re the sort of person who makes ‘beautiful’ feel like an incomplete word.",
  "I don’t think you realize how easy you are to admire.",
  "I think you’re the kind of beautiful that gets better the longer someone knows you.",
  "You make quiet moments feel less empty.",
  "You have this strange habit of making everything around you feel a little warmer.",
  "There’s something about you that makes people want to stay a little longer.",
  "You have a way of making ordinary things look a little more beautiful.",
  "There’s something about you that feels difficult to put into words, but easy to appreciate.",
  "You’re proof that beautiful things don’t always need to ask for attention.",
  "There’s something quietly beautiful about the way you exist.",
];

/* Opsi lanjutan (boleh diabaikan): teks berwaktu format .lrc, dan geser waktu. */
export const LRC = ``;
export const OFFSET = 0;
