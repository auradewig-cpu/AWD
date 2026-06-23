# AWD — Brief Implementasi: Scroll-Scrubbing Frame Sequence

**Untuk**: Claude Code (VS Code)
**Status project**: Mockup hasil export Figma sudah di-extract ke folder project. Dua sequence frame (asset1, asset2) sudah digenerate, dikonversi ke `.webp`, dan ditaruh di dalam folder project.
**Tugas**: Pasang dua background scroll-scrubbing yang independen ke homepage, mengikuti spesifikasi di bawah.

> Brief ini HANYA mencakup fitur scroll-scrubbing. Jangan ubah struktur pricing tier, dashboard admin, atau bagian lain yang sudah diatur di `AWD-Figma-Design-Brief-v2.md` — baca file itu dulu untuk referensi design token (warna, tipografi) yang harus tetap konsisten dipakai di sini.

---

## Fase 0 — Verifikasi Dulu (jangan asumsi)

Sebelum menulis kode apapun:
1. Inventarisasi struktur project hasil export Figma — apakah ini sudah berupa project Next.js App Router yang valid, atau cuma asset statis/markup yang perlu disusun jadi component React.
2. Temukan lokasi pasti folder `asset1` dan `asset2` di dalam project, dan konfirmasi jumlah filenya (seharusnya `hero-sequence-0001.webp` sampai `hero-sequence-0192.webp` di masing-masing folder).
3. Cek apakah GSAP dan ScrollTrigger sudah ada di `package.json` (seharusnya sudah, berdasarkan riwayat project). Kalau belum, install (`npm install gsap`).
4. Baca `AWD-Figma-Design-Brief-v2.md` (kalau ada di project) untuk referensi token warna (`--bg-void`, `--accent-lime`, dst).
5. Laporkan temuan struktur ini dulu sebelum lanjut implementasi, supaya tidak salah asumsi path.

---

## Konteks Aset

**asset1** (192 frame, dipakai di Hero): menggambarkan monolith hitam polos yang retak terbuka secara mekanis, mengungkap inti yang menyala chartreuse-green (#C6FF4A) berisi data stream dan struktur kristal. Kamera melakukan orbit + dolly forward sepanjang sequence.

**asset2** (192 frame, dipakai di section baru "Di Balik Layar"): menggambarkan panel UI dashboard yang mundur/retract secara mekanis, mengungkap mesin gear mekanis dengan aliran data chartreuse-green. **Catatan penting**: ada tint biru di sequence ini yang melanggar disiplin satu-warna-aksen brand (lihat task Color Grading di bawah, wajib dikerjakan sebelum/saat integrasi).

Dua sequence ini independen — TIDAK disambung jadi satu animasi panjang. Masing-masing punya pin section dan scroll range sendiri.

---

## Komponen Inti: `ScrollFrameSequence`

Buat satu komponen reusable yang menerima props seperti folder path frame, jumlah total frame, dan elemen konten yang di-overlay di atasnya — supaya bisa dipakai ulang untuk asset1 maupun asset2 tanpa duplikasi logic.

**Perilaku yang wajib ada:**
- Preload seluruh frame sequence sebelum section itu bisa di-scrub (tampilkan indikator loading ringan kalau perlu, jangan biarkan frame kosong/flicker saat asset belum siap).
- Section di-pin (`ScrollTrigger` dengan `pin: true`, `scrub: true`) selama durasi sequence berlangsung. Setelah frame terakhir tercapai, pin lepas dan scroll lanjut normal ke section berikutnya.
- Mapping posisi scroll ke index frame harus linear dan presisi — scroll cepat, lambat, atau scroll mundur semua harus menampilkan frame yang tepat sesuai posisi, bukan berbasis waktu/durasi.
- **Redraw canvas HANYA saat index frame berubah** (pakai dirty-flag check), jangan redraw di setiap tick tanpa syarat — ini pelajaran langsung dari masalah performa cursor canvas di project lama, jangan diulangi di sini.
- Jarak scroll (`end` value di ScrollTrigger) per sequence idealnya setara 300-400% tinggi viewport — cukup panjang untuk terasa sinematik, tidak terlalu lama sampai terasa membosankan. Sesuaikan dan uji coba manual kalau terasa kurang pas.
- **Cleanup wajib**: kill instance ScrollTrigger dan lepas semua event listener saat komponen unmount. Project lama pernah punya masalah memory leak di scene 3D (GridHelper tidak di-dispose) — pastikan pola yang sama tidak terulang di sini meski implementasinya canvas 2D, bukan WebGL.

---

## Penempatan di Halaman

**Hero** — pasang `ScrollFrameSequence` dengan asset1 sebagai full-bleed background. Konten yang sudah ada di Hero (badge "BERBASIS REACT • BUKAN TEMPLATE", headline "Tampil SeMAHAL Kualitas Bisnismu", subheadline, dua CTA) tetap dipertahankan persis seperti sekarang — cuma backgroundnya yang diganti dari statis/mockup HP jadi sequence asset1. Pastikan kontras teks terhadap background tetap terjaga di semua frame (kalau perlu, tambahkan overlay gradient gelap tipis di belakang teks supaya keterbacaan konsisten di seluruh sequence, bukan cuma di satu frame tertentu).

**Section baru "Di Balik Layar"** — taruh setelah section Proses Kerja, sebelum Pricing. Pasang `ScrollFrameSequence` dengan asset2 sebagai background. Konten overlay:
- Eyebrow badge: "REKAYASA SUNGGUHAN • BUKAN BUILDER VISUAL"
- Headline (placeholder, belum final — beri tahu Awea untuk approval sebelum dianggap selesai): *"Bukan Sekadar Tampilan, Ada Mesin Sungguhan di Baliknya."*
- Subheadline (placeholder): *"Setiap situs AWD dibangun dari kode React/Next.js asli — bukan drag-and-drop, bukan template, bukan plugin yang ditumpuk-tumpuk."*

**Lazy-load asset2**: karena posisinya lebih jauh ke bawah halaman, preload framenya jangan dimulai sejak halaman pertama dibuka — mulai preload saat user sudah scroll mendekati section ini (pakai Intersection Observer dengan margin, mulai load saat section masih ~1 viewport lagi sebelum terlihat). Ini supaya loading awal Hero tidak terbebani aset yang belum dibutuhkan.

---

## Task Wajib: Color Grading asset2

Sequence asset2 punya tint biru yang menonjol (dari prompt generation, "deep blue data filaments") — ini melanggar aturan brand satu-warna-aksen (cuma lime yang boleh jadi warna foreground, biru cuma boleh ambient/background tipis). Sebelum frame asset2 dipakai final, jalankan batch color grading untuk menggeser hue biru ke arah netral/lime — bisa pakai `ffmpeg` dengan filter `hue`/`eq` per-frame, atau library image processing seperti `sharp` di Node. Render hasil sebelum-sesudah pada satu-dua frame contoh dulu untuk verifikasi visual sebelum diterapkan ke seluruh 192 frame.

---

## Mobile & Reduced Motion

- Di bawah breakpoint mobile (sarankan <768px) ATAU saat `prefers-reduced-motion` aktif: jangan render sequence/canvas sama sekali. Ganti dengan satu gambar statis representatif per section (pakai frame tengah, misal frame ke-96, dari masing-masing sequence), tanpa pin scroll.
- Deteksi device/breakpoint ini harus selesai SEBELUM render pertama (server-side atau di awal mount), bukan sesudah — project lama pernah ada race condition di `useIsMobile` yang sempat membebani device mobile dengan scene yang lebih berat sesaat di awal render. Jangan ulangi pola itu.

---

## Performance Budget

- Total ukuran file gabungan tiap sequence (192 frame webp) idealnya di bawah 5MB setelah optimasi. Kalau saat dicek ternyata jauh di atas itu, lakukan kompresi ulang/resize lebar maksimal ~1280px sebelum dipakai.
- Setelah implementasi selesai, jalankan pengecekan dasar performa (build size, tidak ada warning console) — jangan biarkan skor Lighthouse turun drastis dari kondisi yang sudah diperbaiki di audit sebelumnya.

---

## Acceptance Criteria

- Scroll cepat, lambat, dan scroll-mundur di kedua section menampilkan frame yang selalu tepat sesuai posisi scroll.
- Tidak ada error di console, dan tidak ada peningkatan memory yang terus naik setelah scroll naik-turun berkali-kali di kedua section (cek lewat DevTools Performance/Memory).
- Fallback mobile teruji jelas di breakpoint <768px — tidak ada canvas/sequence yang ikut termuat di mode ini.
- `prefers-reduced-motion` dihormati.
- Pin section tidak merusak/menutupi layout section lain di sekitarnya.
- Warna asset2 sudah dikoreksi, tidak ada tint biru mencolok yang tersisa.

## Di Luar Scope Brief Ini

Jangan ubah struktur pricing tier, dashboard admin, atau copy section lain di luar dua section yang disebutkan di atas — itu di luar tugas ini.
