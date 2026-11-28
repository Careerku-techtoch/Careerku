---
title: 07 - UI Components, Styling & GSAP System
tags:
  - careerku
  - design-system
  - css-tokens
  - gsap
  - components
aliases:
  - Design System
  - GSAP Rules
repo_commit: c159766
updated: 2026-11-28
---

# 07 — UI Components, Styling & GSAP System

Kembali ke `[[00 - Careerku Code Flow (MOC)]]`

## 1. Sistem Warna & Design Tokens (`frontend/src/index.css`)

Careerku memakai permukaan hangat berbasis sage-cream (light) dan charcoal-forest (dark), dengan aksen brand **Botanical Forest** dan warna semantik **Muted Editorial Earth** (menghindari ungu generik dan warna neon primer yang bertabrakan).

| Token Group | Light Mode (`:root`) | Dark Mode (`.dark`) | Peran UI |
| :--- | :--- | :--- | :--- |
| **Canvas & Card** | `--bg-canvas: #e4e7db`, `--bg-sheet: #f7f8f2`, `--bg-card: #ffffff` | `--bg-canvas: #111311`, `--bg-sheet: #1f221f`, `--bg-card: #272b27` | Latar luar, sheet bagian dalam, & kartu utama `.careerku-card` |
| **Brand Accent** | `--accent-brand: #1e5640`, `--accent-brand-soft: #dfece5` | `--accent-brand: #72c7a2`, `--accent-brand-soft: rgba(114,199,162,0.16)` | Highlights UI & alias `--accent-indigo*` |
| **Category: Internship** | `--cat-internship: #3c6978` (slate-teal) | `--cat-internship: #73a8b9` | Top accent bar kartu, dot kalender, progress bar |
| **Category: Scholarship** | `--cat-scholarship: #a87f39` (antique ochre) | `--cat-scholarship: #cfa862` | Top accent bar beasiswa & indikator notifikasi |
| **Category: Competition** | `--cat-competition: #a55246` (muted terracotta) | `--cat-competition: #cf8074` | Top accent bar kompetisi |
| **Status Semantic** | Pine `#2a6b4f` / Ochre `#a87f39` / Rust `#a3483e` | `#6fc29e` / `#cfa862` / `#d48276` | Status siap, peringatan, & skill gap / deadline mepet |

---

## 2. Aturan Rekayasa GSAP (Wajib di Seluruh Repo)

> [!warning] Aturan Kritis Anti-Bug Animasi GSAP
> Di `frontend/src/index.css`, elemen `button, a, select, input, textarea` memiliki transisi CSS global (`transition-duration: 160ms` pada `opacity` dan `transform`).
> 1. **Jangan pernah** menganimasikan `y`, `x`, `scale`, atau `opacity` dengan GSAP langsung pada `<button>` atau `<a>` — bungkus elemen interaktif tersebut dalam `<div>` atau `<span>` wrapper lalu animasikan wrapper-nya.
> 2. **Selalu pakai `clearProps: 'transform'`** setelah animasi entrance/transisi selesai agar fitur CSS seperti `hover:-translate-y-*` dan `sticky` (seperti panel kanan di `ProfilePage`) tidak terkunci oleh inline style transform.
> 3. **Aksesibilitas & StrictMode:** Gunakan `gsap.matchMedia()` dengan kondisi `(prefers-reduced-motion: no-preference)` dan `return () => mm.revert()`. Untuk transisi state (tab/filter/bulan kalender), gunakan guard `prevValueRef` alih-alih boolean `hasMountedRef`.
> 4. **Angka Dinamis React:** Jangan jalankan animasi `textContent` roll-up pada metrik yang nilainya berubah langsung di halaman yang sama (misal saat klik chip skill `+` di `AnalyzePage` atau centang dokumen di `TrackerPage`).

---

## 3. Katalog Komponen UI (`frontend/src/components/`)

| Komponen | Lokasi | Mekanisme & Fitur |
| :--- | :--- | :--- |
| **`CareerkuLogo`** | `CareerkuLogo.tsx` | Logo SVG custom berbentuk huruf **C** terbuka + jarum kompas hijau (`#059669` / `#10B981`). Mendukung `size` (`sm`/`md`/`lg`), `showWordmark`, `inverted`, dan `badge`. |
| **`CareerkuMatchGauge`** | `CareerkuMatchGauge.tsx` | Indikator persentase kecocokan berbentuk **logo C** dengan track progres proporsional (`strokeDashoffset`) yang dianimasikan GSAP (`0.85s power2.out`) + pop jarum kompas. Ukuran: `sm`, `md`, `lg`. |
| **`DashboardIcons`** | `DashboardIcons.tsx` | 6 ikon SVG monokrom custom tanpa kotak border: `HighMatchGlyph`, `MatchIndexGlyph`, `DocumentReadyGlyph`, `DeadlinePulseGlyph`, `SkillGapGlyph`, `PortfolioSprintGlyph`. |
| **`OpportunityCard`** | `OpportunityCard.tsx` | Kartu standar katalog (`/discover`): 3px bar kategori di atas, avatar + metadata, `CareerkuMatchGauge`, chip lokasi & kesiapan AI/Checklist, jumlah skill cocok, countdown `D-xx`, serta aksi `View Details` & `Save & Track`. |
| **`MatchBadge`** | `MatchBadge.tsx` | Pill badge skor (`High Match` / `Medium Fit` / `Needs Prep`) untuk `OpportunityDetailDrawer`. |
| **`FolderTabs`** | `FolderTabs.tsx` | Komponen tab folder dengan badge angka (reusable, meski tab filter utama halaman kini memakai monochrome pill terpadu). |
| **`ScrollReveal`** | `ScrollReveal.tsx` | Wrapper generik `ScrollTrigger` (`play none none reverse`) dengan opsional blur reveal (`delayMs`, `distancePx`, `scaleFrom`). |
| **`AppShell` / `ToastBanner` / `OpportunityDetailDrawer`** | Lihat `[[05 - Workspace Shell & Navigation Flow]]` | Infrastruktur navigasi workspace, modal drawer global, dan banner notifikasi. |

---

## Catatan Terkait
- Penggunaan komponen pada halaman workspace: `[[06 - Workspace Pages Flow]]`
- Komponen shell & drawer global: `[[05 - Workspace Shell & Navigation Flow]]`
