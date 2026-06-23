# AWD — Figma Design Brief v2.0 (Rombak Total)

**Brand**: AWD (Aldi Web Designer) — jasa pembuatan website & aplikasi web/software berbasis React/Next.js
**Target Output**: Mockup Figma siap pakai sebagai referensi visual untuk development di Next.js (VS Code)
**Stack tujuan akhir**: Next.js, React, mobile-first, responsive penuh

> **Catatan penting sebelum mulai**: dokumen ini mencakup DUA sistem terpisah —
> (A) Website publik AWD (yang dilihat calon klien), dan
> (B) Dashboard Admin internal AWD (yang hanya dipakai Aldi sendiri untuk kelola bisnis).
> Kredensial `admin@awd.com` / `awd123` di bagian Login Admin adalah untuk dashboard internal (B),
> BUKAN kredensial demo yang nanti ditempel di situs-situs mockup demo per klien (itu kredensial terpisah,
> per-demo, lihat catatan di bagian Demo Detail Page). Kalau maksudnya beda dari ini, koreksi ya.

---

## 1. Brand Essence & Posisi

Positioning: "Kualitas React/Next.js dengan harga yang tidak bikin mikir dua kali." Lawan dari kesan template WordPress murahan, tapi juga lawan dari kesan agency besar yang mahal dan kaku. Nada bicara: percaya diri, jujur soal harga (no hidden cost), sedikit bermain dengan kontras "murah vs mahal" di copywriting (lihat referensi visual: "Tampil SeMAHAL Kualitas Bisnismu").

Target audiens utama: pemilik bisnis dengan kepercayaan visual tinggi terhadap keputusan beli kliennya sendiri (lihat daftar kategori di Section 3.5) — bukan UMKM sembarangan, tapi bisnis yang website bagus = langsung berdampak ke closing mereka.

---

## 2. Sistem Visual (Design Tokens)

### 2.1 Warna

Diturunkan dari referensi visual yang diberikan. Hex di bawah adalah estimasi — saat kerja di Figma, ambil warna presisi langsung dari 3 gambar referensi pakai eyedropper supaya 1:1.

| Token | Hex (estimasi) | Pemakaian |
|---|---|---|
| `--bg-void` | `#07080A` | Background utama, hampir hitam pekat |
| `--bg-surface` | `rgba(255,255,255,0.03)` | Permukaan card sebelum blur |
| `--border-glass` | `rgba(255,255,255,0.08)` | Border tipis di semua glass card |
| `--accent-lime` | `#C6FF4A` | Warna utama: CTA, highlight, angka harga, glow |
| `--accent-lime-dim` | `#8FE000` | Hover state, aksen sekunder |
| `--text-primary` | `#FAFAFA` | Headline, teks utama |
| `--text-secondary` | `rgba(255,255,255,0.68)` | Body text, deskripsi |
| `--text-muted` | `rgba(255,255,255,0.42)` | Caption, label kecil |
| `--glow-blue` | `#4D8CFF` | HANYA untuk ambient blur orb di background, jangan dipakai di teks/tombol |

Aturan: satu warna aksen dominan (lime) — jangan tambah warna aksen kedua/ketiga di UI. Biru hanya untuk glow dekoratif di background, sangat tipis opacity, tidak pernah jadi warna teks atau tombol. Ini yang membedakan kesan "mahal/disengaja" dari kesan "ramai/template".

### 2.2 Tipografi

- **Display** (H1/H2, headline besar): geometric sans bold/extrabold, tracking rapat — contoh: **General Sans** atau **Inter Tight**. Dipakai besar dan percaya diri, sesuai referensi visual.
- **Body** (paragraf, tombol, navigasi): **Inter** — legible, netral, tidak bersaing dengan display face.
- **Utility/Mono** (harga, badge, label HUD-style seperti "BERBASIS REACT • BUKAN TEMPLATE"): **JetBrains Mono** — memberi kesan presisi teknikal, selaras dengan positioning "berbasis React, bukan template".

Skala (desktop → mobile):
- H1: 64px → 36px, weight 800, line-height 1.05
- H2: 40px → 28px, weight 700
- H3: 24px → 20px, weight 600
- Body: 17px → 15px, weight 400-500
- Caption/Label: 12-13px, uppercase, letter-spacing 0.05em, mono

### 2.3 Komponen Dasar

**Tombol Primer** (pill/rounded-full): bg `--accent-lime`, teks `--bg-void` bold, ikon panah trailing (→), hover: scale 1.02 + brightness naik tipis.

**Tombol Sekunder/Outline**: border 1px `--border-glass`, teks `--text-primary`, bg transparan, hover: border jadi `--accent-lime` tipis.

**Glass Badge** (pill mengambang seperti "5.0 RATING", "LOAD CEPAT" di referensi): bg `rgba(255,255,255,0.06)`, backdrop-blur 12px, border 1px `rgba(255,255,255,0.12)`, shadow halus, ikon kecil + teks bold, biasanya diposisikan absolute mengambang di atas mockup HP.

**Pricing Card**: glass surface dengan border standar; tier yang di-highlight (BLAZE+) dapat border `--accent-lime` tipis + glow halus + ribbon "Paling Direkomendasikan".

**Input Field**: bg `rgba(255,255,255,0.04)`, border `--border-glass`, focus state WAJIB ada ring jelas (`--accent-lime` 2px) — ini perbaikan langsung dari temuan audit sebelumnya soal focus state yang hilang.

### 2.4 Elemen Signature

Nama tier kamu (SPARK → IGNITE → BLAZE → BLAZE+ → APEX) sebenarnya sudah membawa makna literal: intensitas yang meningkat, seperti api yang membesar. Ini dipakai jadi satu elemen visual yang berulang dan **benar-benar membawa informasi**, bukan dekorasi kosong: **Indikator Intensitas** — sederetan 5 titik/bar kecil di samping nama tier, terisi lime sesuai level (SPARK = 1/5 terisi, APEX = 5/5 terisi penuh). Konsisten dipakai di pricing card dan demo detail page, jadi orang otomatis paham "tier ini levelnya berapa" tanpa baca detail.

### 2.5 Motion

Satu momen besar di page-load (stagger fade-up elemen Hero, terorkestrasi rapi), scroll-reveal halus per section (fade-up 8px, sekali muncul/`triggerOnce`), dan satu interaksi mouse-tilt halus (maksimal 6 derajat) khusus di mockup HP Hero — **bukan** scene 3D penuh seperti versi lama. Hormati `prefers-reduced-motion`. Lebih sedikit tapi presisi, bukan banyak tapi acak.

---

## 3. Website Publik AWD

### 3.1 Navbar

Logo AWD kiri (pakai logo dari referensi gambar 1). Link tengah: Beranda, Paket Harga, Lihat Demo, Proses Kerja, FAQ, Kontak — pastikan semua link ini benar-benar mengarah ke section yang ada (jangan ulangi masalah broken link `#layanan`/`#portofolio` dari versi lama). CTA kanan: tombol primer "Konsultasi Gratis →".

### 3.2 Hero

- Eyebrow pill: "BERBASIS REACT • BUKAN TEMPLATE" (mono font, kecil)
- H1: *"Tampil **SeMAHAL** Kualitas Bisnismu."* (kata "SeMAHAL" dalam warna lime)
- Subheadline: *"Website profesional mulai Rp999rb. Cepat, aman, desain custom — tanpa beban harga agency besar."*
- Dua CTA: "Konsultasi Gratis →" (primer) + "Lihat Paket Harga" (outline)
- Visual kanan: mockup HP tilted dengan mouse-parallax halus, menampilkan **screenshot situs nyata** yang pernah AWD buat (bukan placeholder fiktif — ini juga menjawab klaim "bukan template" secara jujur)
- Dua glass badge mengambang di sekitar mockup HP: rating bintang + "Load Cepat"

### 3.3 Trust Bar

Baris understated di bawah Hero: *"Dipercaya pemilik klinik, arsitek, dan bisnis premium di Yogyakarta & sekitarnya."* — klaim yang jujur dan tidak menyebut angka spesifik sampai benar-benar ada cukup klien nyata untuk logo wall.

### 3.4 Proses Kerja (5 Langkah)

Numbered 01-05 (sah dipakai di sini karena memang urutan proses nyata): Brief & Konsultasi (Gratis, tanpa komitmen) → Desain Konsep (wireframe 2 hari kerja) → Development (update progress harian via WA) → Review & Revisi (2 putaran revisi gratis) → Launch & Handover (deploy + source code diserahkan). Layout horizontal timeline di desktop, vertical stack di mobile.

### 3.5 Pricing Section

H2: *"Pilih Paket yang Pas untuk Bisnismu"*. Toggle pills: "Tanpa Admin Panel" / "+ Admin Panel" (pastikan ada `aria-pressed`, perbaikan dari temuan audit).

**5 Tier (data harga existing, dipertahankan dari struktur yang sudah berjalan):**

| Tier | Harga (tanpa admin) | Harga (+ admin) | Cocok untuk |
|---|---|---|---|
| SPARK | Rp 999rb (coret Rp 2,5jt) | — | Landing page / promosi awal |
| IGNITE | Rp 3,5jt (coret Rp 6jt) | — | Company profile |
| BLAZE | Rp 8jt (coret Rp 14jt) | Rp 12jt (coret Rp 20jt) | Toko online / web app |
| BLAZE+ ⭐ | Rp 12jt (coret Rp 22jt) | Rp 16jt (coret Rp 28jt) | Toko online + fitur lebih lengkap |
| APEX | Rp 18jt (coret Rp 30jt) | Rp 22jt (coret Rp 38jt) | Custom software / web app kompleks |

Tiap card: nama tier + indikator intensitas (2.4) — subtitle harfiah di bawah nama (mis. "BLAZE — Toko Online + Panel Admin") — harga besar + harga coret kecil di sampingnya — 4-5 fitur dengan ikon centang — dua tombol: "Konsultasi Sekarang" (primer, lime, link WA dengan pesan ter-template per tier) dan "Lihat Demo ▾" (outline, membuka dropdown).

**Dropdown "Lihat Demo"** — dikelompokkan per klaster bisnis (tampilkan hanya klaster yang relevan untuk tier tersebut):

- *Jasa Kepercayaan*: Law Firm, Notaris/PPAT, Konsultan Pajak/Akuntan, Konsultan Keuangan
- *Kesehatan & Estetika Premium*: Klinik Kecantikan, Klinik Gigi, Dokter Spesialis, Klinik Fisioterapi, Klinik Hewan
- *Properti & Ruang*: Arsitektur, Kontraktor/Renovasi, Desain Interior, Developer Properti, Furniture Custom
- *Acara & Gaya Hidup Premium*: Wedding/Event Organizer, Travel Agent, Catering Premium, Studio Yoga/Gym Boutique
- *B2B & Korporat*: Distributor/Importir, Manufaktur, Tech Startup/SaaS

Setiap item dropdown adalah link ke Demo Detail Page (3.6). Di bagian bawah dropdown, ada divider lalu link kecil: *"Butuh sesuatu yang lain? → Request Custom"* yang membuka kotak textarea singkat (Bisnis apa, kebutuhan apa) dengan tombol kirim — masuk sebagai lead, bukan link keluar.

### 3.6 Demo Detail Page (`/demo/[tier]/[kategori]`)

Breadcrumb kecil → H1 nama bisnis demo → mockup HP besar berisi screenshot/thumbnail situs demo → deskripsi singkat 2-3 kalimat → badge tech stack (Next.js, Tailwind) → tombol besar **"Buka Demo Penuh ↗"** (link keluar tab baru ke situs demo sungguhan yang sudah kamu bangun terpisah).

**Untuk tier dengan admin panel (BLAZE+/APEX)**, tampilkan card tambahan di bawah: *"Coba Panel Admin"* — kotak kredensial mono-font (mis. `demo@[nama-bisnis].id` / `demo123` — kredensial unik per-situs demo, BUKAN `admin@awd.com`) + tombol **"Buka Admin Panel ↗"**.

### 3.7 Why AWD

Tabel perbandingan React/Next.js vs WordPress (reuse narasi dari strategi sebelumnya). Tambahkan satu callout box bold: *"Garansi Skor Lighthouse 90+"* — janji performa yang sulit ditandingi agency WordPress, dan jadi pembeda nyata bukan klaim kosong (catatan: ini HARUS diuji sungguhan per project, bukan angka statis seperti versi lama).

### 3.8 FAQ

Accordion 8-10 pertanyaan. Catatan dev: pakai `aria-expanded` + `aria-controls` di tiap tombol (perbaikan dari audit).

### 3.9 Kontak

Form: Nama, Bisnis, Budget (dropdown range), Pesan. Semua field punya `<label>` terpasang benar.

### 3.10 Footer

Logo, nav ulang, kontak WA, sosial media, copyright dengan tahun dinamis (jangan hardcode tahun seperti versi lama).

---

## 4. Halaman Login Admin (Dashboard Internal AWD)

Card glass terpusat di atas background `--bg-void` dengan ambient glow halus konsisten dengan situs publik. Logo AWD di atas. Field Email + Password. Checkbox "Ingat saya" (opsional). Tombol primer "Masuk →".

Untuk kebutuhan mockup Figma, tampilkan caption kecil mono di bawah form: `Demo: admin@awd.com / awd123` — **ini placeholder visual untuk mockup saja**. Saat development sungguhan, ini wajib diganti sistem autentikasi asli (hashed password, bukan kredensial hardcoded di kode) — jangan bawa kredensial contoh ini ke production.

---

## 5. Dashboard Admin Internal (Panel)

Layout: sidebar kiri (collapsible) dengan ikon + label, topbar atas dengan search + notifikasi + avatar profil.

**Sidebar items**: Ringkasan, Leads (CRM), Project, Demo & Portfolio, Pembayaran, Perjanjian Digital, Testimoni, Pengaturan.

### 5.1 Ringkasan (Overview)
Kartu KPI (Leads bulan ini, Project aktif, Pendapatan bulan berjalan, Project butuh follow-up) + grafik pendapatan mini + feed aktivitas terbaru.

### 5.2 Leads / CRM
Papan kanban drag-and-drop: kolom Baru → Follow Up → Nego → Deal → Batal. Tiap kartu: nama lead, sumber (WA/form), tanggal masuk, tier yang diminati.

### 5.3 Manajemen Project
Tabel/list project aktif dengan progress bar tahap (Brief → Desain → Dev → Revisi → Launch). Klik untuk detail: timeline, catatan, dokumen perjanjian terlampir.

### 5.4 Demo & Portfolio Manager
List entri demo (judul, tier, kategori, thumbnail, URL demo, status aktif/nonaktif). Tombol "+ Tambah Demo" membuka modal form: judul, pilih tier, pilih kategori (dari klaster 3.5), URL demo, URL admin panel (opsional), kredensial demo (opsional), upload/tempel thumbnail.

### 5.5 Pembayaran & Invoice
List invoice (klien, project, jumlah, status Lunas/Sebagian/Belum dengan badge warna). Tombol generate invoice baru. Terhubung ke payment gateway (Midtrans/Xendit — support VA, QRIS, kartu) untuk update status real-time.

### 5.6 Perjanjian Digital & Tanda Tangan
List dokumen per project (status: Draft/Menunggu TTD/Selesai). Tombol "Buat Perjanjian Baru" → generate dari template otomatis terisi data klien & harga. Preview dokumen + area canvas tanda tangan digital. Catatan: untuk kekuatan hukum bea meterai yang sah, alur ini idealnya terhubung ke e-meterai resmi Peruri, bukan sekadar gambar stempel statis — ini keputusan teknis untuk fase development, dicatat di sini supaya tidak lupa.

### 5.7 Testimoni Manager
List testimoni dengan toggle aktif/nonaktif. Tombol tambah: nama, peran, foto, kutipan, tier terkait, link project.

### 5.8 Pengaturan Tracking
Form field: Meta Pixel ID, GTM Container ID, GA Measurement ID, kode verifikasi Search Console. Tombol simpan — sistem suntik otomatis ke `<head>` situs publik.

---

## 6. Mobile-First & Responsive

Breakpoint: mobile (<640px) → tablet (640-1024px) → desktop (>1024px). Semua desain dimulai dari mobile dulu, baru di-scale up. Pricing card jadi carousel swipeable horizontal di mobile. Sidebar admin collapse jadi bottom tab bar atau drawer hamburger di mobile. Touch target minimum 44×44px. Dropdown demo di mobile full-screen sheet (bukan dropdown kecil yang susah di-tap).

---

## 7. Cara Pakai Brief Ini di Figma AI

Figma AI generation biasanya bekerja per-frame/per-halaman, bukan seluruh situs sekaligus. Saran urutan input: (1) paste Section 2 (Design Tokens) dulu untuk membangun base style library, (2) baru generate halaman satu-satu mengikuti urutan Section 3 (Hero dulu, baru section berikutnya), (3) lanjut Section 4-5 untuk admin. Setelah semua frame jadi, baru lanjut ke VS Code dengan Next.js mengikuti tokens dan struktur yang sama persis.

---

*Akhir brief. Masih tahap diskusi/desain — belum ada kode yang ditulis.*