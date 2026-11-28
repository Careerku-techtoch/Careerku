# LLM_CONTEXT.md — Careerku (baca file ini PERTAMA di setiap sesi LLM)

> Pembaca: LLM coding assistant dan manusia. Bahasa: Indonesia untuk narasi, English untuk istilah teknis dan kata kunci.
> Kata kunci **MUST**, **MUST NOT**, **SHOULD** bermakna seperti RFC 2119.
> Pasangan file ini: `FRONTEND_FIX_BACKLOG.md` (daftar tugas). Kerjakan **satu task per sesi**.

---

## 1. Apa itu Careerku (identitas, tidak boleh bergeser)

Careerku adalah aplikasi web untuk **mahasiswa S1 yang mencari magang**. Aplikasi membantu mereka:
1. memahami persyaratan sebuah peluang magang,
2. menilai diri terhadap persyaratan itu **berdasarkan bukti**,
3. mengetahui gap yang **spesifik terhadap peluang itu**,
4. mengerjakan tindakan persiapan, lalu
5. menilai ulang kesiapan.

Alur utama (opportunity-centered, bukan wizard linear):

`Discover → Assess → Understand gap → Improve → Reassess`

Satu peluang = satu konteks penilaian. Mahasiswa boleh berpindah ke peluang lain dan menilai secara terpisah.

Rantai mekanisme inti (jangan diputus):

`Opportunity Requirements → Student Evidence → Assessment (3 dimensi) → Gap → Action → New Evidence → Reassessment`

Ini kompetisi **STACK 2026 Hackathon, semifinal, Case 1: Smarter Campus and Learning**. Yang dinilai adalah mekanisme inti yang jujur dan bisa dijelaskan, bukan jumlah fitur.

## 2. Invariants (aturan yang tidak boleh dilanggar oleh kode apa pun)

| ID | Aturan |
|---|---|
| I-01 | MUST NOT ada **persentase kecocokan** atau skor gabungan di UI, data, maupun kode. Jangan tampilkan "Match Score", "% match", gauge, tier High/Medium/Low. |
| I-02 | Penilaian MUST memisahkan **tiga dimensi**: Formal Eligibility, Competency Match, Evidence Sufficiency. Tidak boleh digabung jadi satu angka. |
| I-03 | **Ketiadaan bukti ≠ ketiadaan kemampuan.** Status `does_not_meet` HANYA boleh untuk kriteria formal objektif (IPK, semester, jurusan). Untuk kompetensi, gunakan status bukti. |
| I-04 | Setiap hasil penilaian MUST punya `reason` (kalimat yang bisa dibaca manusia) yang menjelaskan *mengapa* status itu muncul. |
| I-05 | Menambah klaim skill saja MUST NOT menaikkan status menjadi `supported`. Hanya bukti yang menaikkan status. |
| I-06 | Rekomendasi/tugas MUST terkait satu persyaratan tertentu (`requirementId`). Dilarang saran generik ("belajar coding", "buat proyek"). |
| I-07 | MUST NOT menampilkan data simulasi seolah nyata. Semua data punya `origin` (`sample` / `fixture` / `extracted`) dan UI MUST menampilkannya. |
| I-08 | MUST NOT menulis klaim yang belum benar: OCR, scraping otomatis, "AI-powered", "verified", "LLM-powered" (lihat Bagian 4). |
| I-09 | Fokus MVP = **internship**. Competition dan scholarship ditunda (disimpan di `src/_deferred/`, jangan dihapus). |
| I-10 | Apply/Track, CV, motivation letter, dashboard analitik BUKAN inti. MUST NOT dikembangkan di fase ini. |
| I-11 | Privacy by design: data profil hanya di browser (localStorage), ada tombol hapus semua data, dan profil mahasiswa MUST NOT dikirim ke LLM untuk ekstraksi. |
| I-12 | MUST NOT mengarang statistik, hasil wawancara, atau akurasi AI di UI/teks/data. |

## 3. Keputusan terkunci (jangan diperdebatkan ulang tanpa persetujuan lead)

| ID | Keputusan | Alasan singkat |
|---|---|---|
| D-01 | Stack tidak berubah: React 19, TypeScript, Vite 8, Tailwind v4, React Router v7, Zod v4, Axios, GSAP, React Context. | Hindari rewrite. |
| D-02 | Tracker (page + state + tipe) dipindah ke `src/_deferred/`, route dihapus. | Fitur pendukung, 897 baris, memuat draft CV/surat. |
| D-03 | Dashboard dipindah ke `src/_deferred/`. `/dashboard` di-redirect ke `/discover`. | 1385 baris, penuh metrik arbitrer berbasis skor. |
| D-04 | Navigasi final 3 item: **Opportunities** (`/discover`), **Assessment** (`/analyze`), **Profile** (`/profile`). Path `/analyze` dipertahankan. | Alur inti saja. |
| D-05 | `profile.experiences` dilebur ke `profile.evidence` (type `experience`). `profile.skills` diganti nama `claimedSkills` (self-declared). | Satu model bukti. |
| D-06 | Data sample MUST memakai nama organisasi **fiktif** berakhiran "(Sample)" dan `sourceUrl: null`. Nama perusahaan nyata dengan persyaratan karangan dilarang. Untuk demo final, tambahkan 2–3 posting **nyata** lewat jalur ekstraksi (`origin: 'extracted'`). | Hindari misinformasi. |
| D-07 | Task bersifat **derived** dari hasil penilaian; status selesai ditentukan engine, bukan checkbox manual. | Mencegah manipulasi; sederhana. |
| D-08 | Kode domain (`src/domain/`) MUST pure TypeScript: tanpa React, tanpa localStorage, tanpa `Date.now()` langsung (inject `now`). | Mudah dites. |
| D-09 | Ekstraksi: frontend hanya memanggil `POST /api/extract`. Tidak ada SDK LLM dan tidak ada API key di frontend. | Keamanan. |
| D-10 | Tidak ada state library baru, tidak ada dependency baru kecuali Vitest (dan pendukungnya). | Scope. |

## 4. Kosakata

**UI copy berbahasa Inggris** (target juri dan aplikasi sudah berbahasa Inggris).

| Konsep | Gunakan | Jangan gunakan |
|---|---|---|
| Data contoh | "Sample data", "Illustrative sample" | "Verified listing", "Live" |
| Hasil ekstraksi | "Extracted <waktu>" + tautan sumber | "Verified", "AI verified" |
| Bukti dengan tautan | "Has public link" | "Verified evidence" |
| Skill buatan sendiri | "Claimed skills (self-declared)" | "Verified skills" |
| Ringkasan penilaian | "Formal: 3/3 met · Competency: 4/6 stated · Evidence: 2/4 with link" | "87% match", "High match" |
| Logika aturan | "Rule-based assessment" | "AI-powered matching" |
| Ekstraksi LLM | "LLM-assisted extraction" (hanya saat mode `live` benar-benar jalan) | "AI + OCR" (kecuali OCR benar-benar ada) |
| Saran terkurasi | "Curated guidance" | "AI recommendation" |

## 5. Status penilaian (kontrak final)

| Dimensi | `dimension` | Status | Label UI |
|---|---|---|---|
| Formal Eligibility | `formal` | `meets` | Meets requirement |
| | | `does_not_meet` | Does not meet requirement |
| | | `unable_to_assess` | Unable to assess |
| Competency Match + Evidence Sufficiency | `competency` | `supported` | Supported by evidence |
| | | `partial` | Partially supported |
| | | `evidence_needed` | Evidence needed |
| | | `not_stated` | Not stated yet |
| Lainnya (teks bebas) | `other` | `unable_to_assess` | Review manually |

Aturan kompetensi (deterministik, urutan evaluasi penting):
1. `stated` = skill ada di `claimedSkills` ATAU ada di `skills` pada minimal satu `EvidenceItem` (setelah normalisasi alias).
2. `hasLink` evidence = `url` berupa http(s) yang valid DAN `type !== 'coursework'`.
3. stated + ada evidence dengan link → `supported`.
4. stated + ada evidence tanpa link (atau `coursework`) → `partial`.
5. stated + tanpa evidence sama sekali → `evidence_needed` (`claimed: true`).
6. tidak stated → `not_stated` (`claimed: false`).

Tiga ringkasan dimensi:
- **Formal Eligibility**: `{ meets, doesNotMeet, unableToAssess, total }`
- **Competency Match**: `{ stated, notStated, total }`
- **Evidence Sufficiency** (hanya atas kompetensi yang stated): `{ withLink, withoutLink, none, totalStated }`

Catatan jujur: "has link" hanya berarti ada tautan publik yang bisa dibuka peninjau, BUKAN bahwa Careerku memverifikasinya. Ini keterbatasan yang diakui (tulis di proposal).

## 6. Konvensi kode (jebakan konfigurasi proyek)

- `tsconfig.app.json`: `verbatimModuleSyntax: true` → gunakan `import type { ... }` untuk tipe.
- `erasableSyntaxOnly: true` → **dilarang** `enum`, `namespace`, parameter properties. Gunakan union string literal.
- `noUnusedLocals` dan `noUnusedParameters` aktif → hapus impor/variabel yang tidak dipakai, atau build gagal.
- Alias import: `@/` → `src/`. Barrel exports ada di `components/index.ts`, `pages/index.ts`, `services/index.ts`, `utils/index.ts`, `hooks/index.ts`. Perbarui barrel saat menambah/menghapus modul.
- Styling: Tailwind v4 dengan CSS variables yang sudah ada, contoh `bg-[var(--bg-card)]`, `text-[var(--text-primary)]`, `border-[var(--border-subtle)]`, `bg-[var(--status-success-soft)]`, `text-[var(--status-danger-text)]`. Jangan membuat sistem warna baru. Variabel `--cat-*` milik kategori yang ditunda.
- Animasi GSAP: boleh dipertahankan di halaman yang ada, TIDAK perlu di komponen baru. Hormati `prefers-reduced-motion`.
- Semua akses `localStorage` HANYA lewat `src/services/storage.ts` (dibuat di T-220).
- Fungsi domain pure; side effect hanya di store, service, dan komponen.
- Teks UI Inggris; komentar kode boleh Indonesia atau Inggris, konsisten dalam satu file.

## 7. Struktur target (setelah semua task)

```
frontend/src/
  config/scope.ts              # ACTIVE_CATEGORIES, FEATURE flags
  domain/                      # PURE TS
    types.ts  skills.ts  majors.ts  assessment.ts  actions.ts  snapshots.ts  schemas.ts
    *.test.ts
  services/
    api.ts  env.ts(utils)  storage.ts  extraction.ts  extractionFixtures.ts  sampleData.ts
  hooks/ careerkuContext.ts  useCareerkuStore.tsx
  components/
    AppShell  OpportunityCard  OpportunityDetailDrawer
    assessment/ RequirementStatusBadge  AssessmentSummary  AssessmentChips  RequirementList
                EvidenceForm  EvidenceList  ActionPlanPanel  ReassessmentPanel  DataOriginBadge
    extraction/ ExtractOpportunityPanel
  pages/ WelcomePage AuthPage DiscoverPage AnalyzePage ProfilePage
  _deferred/                   # kode ditunda, DIKECUALIKAN dari tsc dan lint
    DashboardPage.legacy.tsx  tracker/  components/(MatchBadge, CareerkuMatchGauge)
    matching.legacy.ts  mockData.nonInternship.ts
```

## 8. Protokol kerja LLM (ikuti persis)

1. Baca `LLM_CONTEXT.md` (file ini) lalu **satu** task di `FRONTEND_FIX_BACKLOG.md`.
2. **Sebelum mengubah apa pun**, tulis rencana pendek: file yang akan diubah/dibuat, dan file yang TIDAK akan disentuh.
3. Verifikasi nomor baris dengan `grep` (nomor di backlog hanyalah petunjuk dari snapshot repo; bisa bergeser).
4. Ubah seminimal mungkin. Jangan refactor di luar task. Jangan mengganti nama route, dependency, atau stack.
5. Jalankan `npm run check` (lint + tsc + test) di folder `frontend/`. Perbaiki sampai hijau.
6. Jalankan `grep` regresi yang tercantum pada task (jika ada).
7. Tutup dengan ringkasan: file yang berubah, kriteria penerimaan yang terpenuhi, hal yang belum selesai.
8. **Berhenti dan tanya manusia** jika: task menuntut mengubah invariants/keputusan terkunci, menambah dependency, menyentuh file di luar daftar, atau ada dua instruksi yang bertentangan. Jangan menebak.

### Template prompt (salin ke LLM)

```
Konteks: baca LLM_CONTEXT.md.
Tugas: kerjakan HANYA task <T-xxx> dari FRONTEND_FIX_BACKLOG.md.
Langkah: (1) tulis rencana + daftar file yang akan diubah, (2) tunggu saya setujui,
(3) implementasi minimal, (4) jalankan `npm run check`, (5) ringkas hasil terhadap
Acceptance Criteria. Jangan menyentuh file di luar daftar. Jangan menambah dependency.
Jika ada ambiguitas atau konflik dengan Invariants/Locked Decisions, berhenti dan tanya.
```

## 9. Jangan lakukan (daftar larangan untuk LLM)

- Jangan menambah halaman atau route baru. (Ekstraksi hidup sebagai panel di Discover.)
- Jangan membuat endpoint, backend, atau database di dalam `frontend/`.
- Jangan menghapus kode ditunda; pindahkan ke `src/_deferred/`.
- Jangan "memperbaiki" dengan menambah skor atau bobot baru, persentase, atau peringkat tersembunyi.
- Jangan mengubah teks klaim menjadi lebih menarik; ubah menjadi **lebih jujur**.
- Jangan menambahkan data fiktif yang meniru hasil riset, testimoni, atau statistik pengguna.
- Jangan memakai substring matching (`includes`) untuk mencocokkan skill atau jurusan.
